from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import cv2
import numpy as np
import base64
import gridfs

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
client = MongoClient("your mongoDB url")
db = client['face_recognition_db']
fs = gridfs.GridFS(db)

# Load pre-trained classifiers (Ensure paths are correct)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')

@app.route('/api/capture-face', methods=['POST'])
def capture_face():
    data = request.json
    # print("Received data for /capture-face:", data)  # Debugging

    image_data = data['image'].split(",")[1]  # Remove prefix if present
    binary_image = base64.b64decode(image_data)
    print("Decoded binary image data:", binary_image[:20])  # Print first 20 bytes for verification

    # Save image to MongoDB using GridFS
    image_id = fs.put(binary_image, content_type="image/png")
    print("Image saved to MongoDB with files_id:", image_id)

    return jsonify({"message": "Image captured and saved", "image_id": str(image_id)}), 200

@app.route('/api/verify-face', methods=['POST'])
def verify_face():
    print("\033[92mStarting face verification...\033[0m")

    try:
        data = request.get_json()
        # print("Received data for /verify-face:", data)  # Debugging

        img_base64 = data.get('image')
        if not img_base64:
            print("No image provided in the request")  # Debugging
            return jsonify({"error": "No image provided"}), 400

        # Ensure correct padding for base64 string
        img_base64 = img_base64.split(",")[-1]  # Remove prefix if present
        print("Base64 image data after prefix removal:", img_base64[:20])  # Print first 20 chars for verification

        padding = len(img_base64) % 4
        if padding != 0:
            img_base64 += "=" * (4 - padding)
        print("Base64 image data after padding adjustment:", img_base64[:20])  # Print first 20 chars again

        # Decode the base64 string to binary image
        img_data = base64.b64decode(img_base64)
        print("Binary image data length after decoding:", len(img_data))  # Debugging

        np_img = np.frombuffer(img_data, dtype=np.uint8)
        print("Numpy array shape and dtype:", np_img.shape, np_img.dtype)  # Debugging

        # Decode image using OpenCV
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        print("\033[92mImage decoded successfully, applying face detection...\033[0m")

        if img is None or img.size == 0:
            print("Failed to decode image with OpenCV")  # Debugging
            return jsonify({"error": "Failed to decode image"}), 400
        print("Decoded image shape:", img.shape)  # Debugging

        # Convert image to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        print("Grayscale image shape:", gray.shape)  # Debugging

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        # print("Faces detected:", len(faces))  # Debugging
        print("\033[92mFaces detected:", len(faces), "\033[0m")


        if len(faces) == 0:
            return jsonify({"message": "No face detected"}), 400

        # Verify eyes within the detected face(s)
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]
            eyes = eye_cascade.detectMultiScale(roi_gray)
            # print("Eyes detected in face:", len(eyes))  # Debugging

            if len(eyes) == 0:
                return jsonify({"message": "No eyes detected in the face"}), 400

        print("\033[92mFace verification successfully completed.\033[0m")
        return jsonify({"message": "Face verified successfully!"}), 200

    except Exception as e:
        print("Error:", e) 
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

