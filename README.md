# NoSQL BE Example

This project is a Node.js application that uses MongoDB as its database. It provides a REST API for managing "Mahasiswa" data.

## Prerequisites

Before running this project, ensure you have the following installed on your device:
- [Node.js](https://nodejs.org/) (version 16 or later is recommended)
- [MongoDB](https://www.mongodb.com/) (or access to a MongoDB Atlas cluster)

## Installation

1. ### **Clone the Repository**  
   Clone this repository to your local machine:
   ```bash
   git clone <repository-url>
   cd noSQL-Kelas
2. ### **Install dependencies**
   
   Install these packages to make sure that the project can run,
   ```bash
    npm install
    npm install express
    npm install mongoose
    npm install dotenv
   ```
3. ### **Setup .env**
   
   Create a .env file in the root folder of the project. To access the database you must make a variable that is the link to the mongoDB database
   ```bash
    mongo_URL = x
    # contact me for more info
   ```
4. ### **Running the app**
   

   1. **Start the server** 
        
        Run this script in your terminal
        ```bash
        npm start
        ```
   2. **Access the API**

        Use Postman or your preferred browser to access the API, the base URL is
        ```
        http://localhost:4000
        ```
6. ### **Testing the app**
    To test the app make sure to update the base url in postman / preferred testing app to be
    ```
    http://localhost:4000/api/mahasiswa/
    ```

  ## Mahasiswa Endpoint

  ### Add Mahasiswa
- **URL**: `POST /api/mahasiswa/addMahasiswa`
- **Description**: Add a new mahasiswa.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "npm": "12345678",
    "jurusan": "Informatika",
    "IPK": 3.5,
    "semester": 6
  }
  ```
- **Response**:
  ```json
  {
    "message": "Data Mahasiswa berhasil ditambahkan",
    "data": {
      "_id": "645e1234567890abcdef1234",
      "name": "John Doe",
      "npm": "12345678",
      "jurusan": "Informatika",
      "IPK": 3.5,
      "semester": 6
    }
  }
  ```

---

### Get All Mahasiswa
- **URL**: `GET /api/mahasiswa/getMahasiswa`
- **Description**: Retrieve all mahasiswa.
- **Response**:
  ```json
  [
    {
      "_id": "645e1234567890abcdef1234",
      "name": "John Doe",
      "npm": "12345678",
      "jurusan": "Informatika",
      "IPK": 3.5,
      "semester": 6
    },
    {
      "_id": "645e567890abcdef12345678",
      "name": "Jane Doe",
      "npm": "87654321",
      "jurusan": "Sistem Informasi",
      "IPK": 3.8,
      "semester": 7
    }
  ]
  ```

---

### Update Mahasiswa by NPM
- **URL**: `PUT /api/mahasiswa/updateMahasiswa/:npm`
- **Description**: Update a mahasiswa's data by their NPM.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "jurusan": "Sistem Informasi",
    "IPK": 3.8,
    "semester": 7
  }
  ```
- **Response**:
  ```json
  {
    "message": "Data Mahasiswa berhasil diperbarui",
    "data": {
      "_id": "645e1234567890abcdef1234",
      "name": "Jane Doe",
      "npm": "12345678",
      "jurusan": "Sistem Informasi",
      "IPK": 3.8,
      "semester": 7
    }
  }
  ```

---

### Delete Mahasiswa by NPM
- **URL**: `DELETE /api/mahasiswa/deleteMahasiswa/:npm`
- **Description**: Delete a mahasiswa by their NPM.
- **Response**:
  ```json
  {
    "message": "Data Mahasiswa berhasil dihapus"
  }
  ```

## **Matkul Endpoints**

### Add Matkul
- **URL**: `POST /api/matkul/addMatkul`
- **Description**: Add a new course (matkul).
- **Request Body**:
  ```json
  {
    "kode": "SBD",
    "nama": "Sistem Basis Data",
    "sks": 4
  }
  ```
- **Response**:
  ```json
  {
    "message": "Data Mata Kuliah berhasil ditambahkan",
    "data": {
      "_id": "645e1234567890abcdef1234",
      "kode": "SBD",
      "nama": "Sistem Basis Data",
      "sks": 4
    }
  }
  ```

---

### Get All Matkul
- **URL**: `GET /api/matkul/getMatkul`
- **Description**: Retrieve all courses (matkul).
- **Response**:
  ```json
  [
    {
      "_id": "645e1234567890abcdef1234",
      "kode": "SBD",
      "nama": "Sistem Basis Data",
      "sks": 4
    },
    {
      "_id": "645e567890abcdef12345678",
      "kode": "AI",
      "nama": "Artificial Intelligence",
      "sks": 3
    }
  ]
  ```

---

### Update Matkul by Kode
- **URL**: `PUT /api/matkul/updateMatkul/:kode`
- **Description**: Update a course (matkul) by its `kode`.
- **Example**: `/api/matkul/updateMatkul/SBD`
- **Request Body**:
  ```json
  {
    "nama": "Sistem Basis Data dan Praktikum",
    "sks": 5
  }
  ```
- **Response**:
  ```json
  {
    "message": "Data Mata Kuliah berhasil diperbarui",
    "data": {
      "_id": "645e1234567890abcdef1234",
      "kode": "SBD",
      "nama": "Sistem Basis Data dan Praktikum",
      "sks": 5
    }
  }
  ```

---

### Delete Matkul by Kode
- **URL**: `DELETE /api/matkul/deleteMatkul/:kode`
- **Description**: Delete a course (matkul) by its `kode`.
- **Example**: `/api/matkul/deleteMatkul/SBD`
- **Response**:
  ```json
  {
    "message": "Data Mata Kuliah berhasil dihapus"
  }
  ```



## **Enrollment Endpoints**

### Add Enrollment
- **URL**: `POST /api/enrollments/addEnrollment`
- **Description**: Add a new enrollment for a mahasiswa in a course.
- **Request Body**:
  ```json
  {
    "npm": "12345678",
    "courseCode": "SBD",
    "grade": "A"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Enrollment successfully added",
    "data": {
      "_id": "645e1234567890abcdef1234",
      "npm": "12345678",
      "courseCode": "SBD",
      "grade": "A",
      "enrollmentDate": "2025-05-07T12:34:56.789Z"
    }
  }
  ```

---

### Get All Enrollments
- **URL**: `GET /api/enrollments/getAllEnrollments`
- **Description**: Retrieve all enrollments.
- **Response**:
  ```json
  [
    {
      "_id": "645e1234567890abcdef1234",
      "npm": "12345678",
      "courseCode": "SBD",
      "grade": "A",
      "enrollmentDate": "2025-05-07T12:34:56.789Z",
      "user": {
        "name": "John Doe",
        "npm": "12345678",
        "jurusan": "Informatika"
      },
      "course": {
        "kode": "SBD",
        "nama": "Sistem Basis Data",
        "sks": 4
      }
    }
  ]
  ```

---

### Get Enrollment by NPM
- **URL**: `GET /api/enrollments/getEnrollmentByNPM/:npm`
- **Description**: Retrieve all enrollments for a specific mahasiswa by their NPM.
- **Example**: `/api/enrollments/getEnrollmentByNPM/12345678`
- **Response**:
  ```json
  [
    {
      "_id": "645e1234567890abcdef1234",
      "npm": "12345678",
      "courseCode": "SBD",
      "grade": "A",
      "enrollmentDate": "2025-05-07T12:34:56.789Z",
      "course": {
        "kode": "SBD",
        "nama": "Sistem Basis Data",
        "sks": 4
      }
    }
  ]
  ```

---

### Update Enrollment
- **URL**: `PUT /api/enrollments/updateEnrollment/:id`
- **Description**: Update an enrollment by its ID.
- **Example**: `/api/enrollments/updateEnrollment/645e1234567890abcdef1234`
- **Request Body**:
  ```json
  {
    "grade": "B"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Enrollment successfully updated",
    "data": {
      "_id": "645e1234567890abcdef1234",
      "npm": "12345678",
      "courseCode": "SBD",
      "grade": "B",
      "enrollmentDate": "2025-05-07T12:34:56.789Z"
    }
  }
  ```

---

### Delete Enrollment
- **URL**: `DELETE /api/enrollments/deleteEnrollment/:id`
- **Description**: Delete an enrollment by its ID.
- **Example**: `/api/enrollments/deleteEnrollment/645e1234567890abcdef1234`
- **Response**:
  ```json
  {
    "message": "Enrollment successfully deleted"
  }
  ```

---
