# import face_recognition
# import numpy as np
# import cv2
# import base64
# from io import BytesIO
# from flask import Flask, request, jsonify
# from PIL import Image

# app = Flask(__name__)

# # Assume that the user's registered face encoding is stored here
# # In a real-world scenario, you would store it in a database
# registered_face_encoding = None

# # Helper function to convert base64 image to numpy array
# def decode_base64_image(base64_str):
#     # Decode the base64 string
#     img_data = base64.b64decode(base64_str)
#     img = Image.open(BytesIO(img_data))
#     img = np.array(img)
#     return img

# # Endpoint to register a user's face (simulating registration step)
# @app.route('/api/register-face', methods=['POST'])
# def register_face():
#     global registered_face_encoding
#     try:
#         data = request.json
#         face_image_base64 = data.get('faceImage')  # Base64 encoded face image
        
#         # Decode image
#         img = decode_base64_image(face_image_base64)
        
#         # Find face encodings in the uploaded image
#         face_locations = face_recognition.face_locations(img)
#         if len(face_locations) == 0:
#             return jsonify({"err": "No face detected in the image."}), 400
        
#         # Encode the detected face
#         encodings = face_recognition.face_encodings(img, face_locations)
#         if len(encodings) == 0:
#             return jsonify({"err": "Unable to encode face."}), 400
        
#         # Register the first face encoding (in this case, we just take the first one)
#         registered_face_encoding = encodings[0]
#         return jsonify({"message": "Face registered successfully."}), 200

#     except Exception as e:
#         return jsonify({"err": str(e)}), 500

# # Endpoint for face verification during login
# @app.route('/api/verify-face', methods=['POST'])
# def verify_face():
#     try:
#         if registered_face_encoding is None:
#             return jsonify({"err": "No face registered."}), 400
        
#         data = request.json
#         face_image_base64 = data.get('faceImage')  # Base64 encoded face image
        
#         # Decode the face image
#         img = decode_base64_image(face_image_base64)
        
#         # Find face encodings in the uploaded image
#         face_locations = face_recognition.face_locations(img)
#         if len(face_locations) == 0:
#             return jsonify({"err": "No face detected in the image."}), 400
        
#         # Encode the detected face
#         encodings = face_recognition.face_encodings(img, face_locations)
#         if len(encodings) == 0:
#             return jsonify({"err": "Unable to encode face."}), 400
        
#         # Compare the newly detected face with the registered face
#         match = face_recognition.compare_faces([registered_face_encoding], encodings[0])
        
#         if match[0]:
#             return jsonify({"success": True, "message": "Face verification successful."}), 200
#         else:
#             return jsonify({"success": False, "message": "Face verification failed."}), 400

#     except Exception as e:
#         return jsonify({"err": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)





# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from bson import ObjectId
# import base64
# import gridfs
# import numpy as np
# import face_recognition
# from io import BytesIO
# from PIL import Image

# app = Flask(__name__)
# CORS(app)

# # Configure MongoDB connection
# client = MongoClient("mongodb+srv://geeky573:Geeky%40123@cluster0.ykbda.mongodb.net/WorkPlace?retryWrites=true&w=majority")  # Update your MongoDB URI here
# db = client['face_recognition']
# fs = gridfs.GridFS(db)

# # Helper function to decode base64 to image
# def decode_base64_image(base64_str):
#     img_data = base64.b64decode(base64_str)
#     img = Image.open(BytesIO(img_data))
#     return np.array(img)

# # Route to capture and store face image in MongoDB
# @app.route('/api/capture-face', methods=['POST'])
# def capture_face():
#     try:
#         data = request.json
#         image_data = data['image'].split(",")[1]  # Remove "data:image/png;base64," prefix
#         binary_image = base64.b64decode(image_data)

#         # Decode the image to numpy array
#         img = decode_base64_image(image_data)

#         # Use face_recognition to get face encoding
#         face_locations = face_recognition.face_locations(img)
#         if len(face_locations) == 0:
#             return jsonify({"error": "No face detected in the image"}), 400
        
#         face_encodings = face_recognition.face_encodings(img, face_locations)
#         if len(face_encodings) == 0:
#             return jsonify({"error": "No face encodings found"}), 400
        
#         # Save the image to GridFS
#         image_id = fs.put(binary_image, content_type="image/png")
        
#         # Store face encoding in MongoDB along with image ID
#         user_face_data = {
#             "image_id": str(image_id),
#             "face_encoding": face_encodings[0].tolist()  # Convert numpy array to list
#         }
#         db.users.insert_one(user_face_data)

#         return jsonify({"message": "Image captured and saved", "image_id": str(image_id)}), 200
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Route to verify face using image and stored face encoding
# @app.route('/api/verify-face', methods=['POST'])
# def verify_face():
#     try:
#         data = request.json
#         image_data = data['image'].split(",")[1]  # Remove "data:image/png;base64," prefix
#         binary_image = base64.b64decode(image_data)

#         # Decode the image to numpy array
#         img = decode_base64_image(image_data)

#         # Use face_recognition to get face encoding
#         face_locations = face_recognition.face_locations(img)
#         if len(face_locations) == 0:
#             return jsonify({"error": "No face detected in the image"}), 400
        
#         face_encodings = face_recognition.face_encodings(img, face_locations)
#         if len(face_encodings) == 0:
#             return jsonify({"error": "No face encodings found"}), 400

#         detected_encoding = face_encodings[0]

#         # Retrieve stored face encoding from the database
#         user_face_data = db.users.find_one()
#         if not user_face_data:
#             return jsonify({"error": "No user data found in the database"}), 404

#         stored_encoding = np.array(user_face_data['face_encoding'])

#         # Compare the face encodings
#         matches = face_recognition.compare_faces([stored_encoding], detected_encoding)

#         if matches[0]:
#             return jsonify({"message": "Face verification successful"}), 200
#         else:
#             return jsonify({"message": "Face verification failed"}), 400

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)



from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import face_recognition
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import base64
import gridfs

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
client = MongoClient("mongodb+srv://geeky573:Geeky%40123@cluster0.ykbda.mongodb.net/WorkPlace?retryWrites=true&w=majority")  # Update to your MongoDB URI
db = client['face_recognition_db']
fs = gridfs.GridFS(db)


@app.route('/api/capture-face', methods=['POST'])
def capture_face():
    data = request.json
    image_data = data['image'].split(",")[1]  # Remove "data:image/png;base64," prefix
    binary_image = base64.b64decode(image_data)

    # Save image to MongoDB using GridFS
    image_id = fs.put(binary_image, content_type="image/png")
    return jsonify({"message": "Image captured and saved", "image_id": str(image_id)}), 200

# Route for face verification



# @app.route('/api/verify-face', methods=['POST'])
# def verify_face():
#     try:
#         # Get the base64-encoded image data from the request
#         data = request.json
#         face_data = data.get('image')  # base64 string

#         # Decode the base64 string to bytes
#         img_data = base64.b64decode(face_data.split(',')[1])  # Remove the "data:image/png;base64," part

#         # Convert the byte data to an image using PIL (Pillow)
#         image = Image.open(BytesIO(img_data))

#         # Ensure the image is in RGB format (required by face_recognition)
#         image = image.convert('RGB')
#         print("image", image)
#         # Convert the image to a numpy array (required by face_recognition)
#         img_rgb = np.array(image)
#         print("img_rgb", img_rgb)

#         # Detect face encodings from the image
#         uploaded_face_encoding = face_recognition.face_encodings(img_rgb)

#         if not uploaded_face_encoding:
#             return jsonify({"message": "No face detected."}), 400

#         # Here you can compare the detected face encoding with the stored ones
#         # For simplicity, we assume a successful match
#         return jsonify({"message": "Face verified successfully!"})

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify({"message": "Face verification failed. Please try again."}), 500




# Load pre-trained classifiers
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')

@app.route('/api/verify-face', methods=['POST'])
def verify_face():
    try:
        # Get the image from the request
        data = request.get_json()
        img_base64 = data.get('image')

        if not img_base64:
            return jsonify({"error": "No image provided"}), 400

        # Add padding if necessary to make the base64 string length a multiple of 4
        padding = len(img_base64) % 4
        if padding != 0:
            img_base64 += "=" * (4 - padding)

        # Decode the image from base64
        img_data = base64.b64decode(img_base64)
        np_img = np.frombuffer(img_data, dtype=np.uint8)
        print("np_img",np_img)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        print("img", img)
        # if img is None:
        #     return jsonify({"error": "Failed to decode image"}), 400
        # Convert image to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"message": "No face detected"}), 400

        # Loop through faces and check for eyes
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]
            roi_color = img[y:y + h, x:x + w]
            eyes = eye_cascade.detectMultiScale(roi_gray)

            if len(eyes) == 0:
                return jsonify({"message": "No eyes detected in the face"}), 400

        return jsonify({"message": "Face and eyes verified successfully!"}), 200

    except Exception as e:
        print("error kya hai", e)
        return jsonify({"success ": str(e)}), 200






if __name__ == '__main__':
    app.run(debug=True, port=5000)

