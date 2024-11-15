from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from PIL import Image
from io import BytesIO
import base64
import gridfs

app = Flask(__name__)
CORS(app)

# Configure MongoDB connection
client = MongoClient("mongodb+srv://geeky573:Geeky%40123@cluster0.ykbda.mongodb.net/WorkPlace?retryWrites=true&w=majority")  # Update as needed
db = client['face_recognition']
fs = gridfs.GridFS(db)

@app.route('/api/capture-face', methods=['POST'])
def capture_face():
    data = request.json
    image_data = data['image'].split(",")[1]  # Remove "data:image/png;base64," prefix
    binary_image = base64.b64decode(image_data)

    # Save image to MongoDB using GridFS
    image_id = fs.put(binary_image, content_type="image/png")
    return jsonify({"message": "Image captured and saved", "image_id": str(image_id)}), 200

@app.route('/api/get-face/<image_id>', methods=['GET'])
def get_face(image_id):
    try:
        # Retrieve the image from GridFS
        image_binary = fs.get(ObjectId(image_id)).read()
        image_base64 = base64.b64encode(image_binary).decode('utf-8')
        return jsonify({"image": "data:image/png;base64," + image_base64}), 200
    except Exception as e:
        return jsonify({"error": "Image not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
