# Kelompok 9

## Anggota Kelompok

 * Audy Natalie Cecilia R (2306266962)
 * Muhammad Raditya Alif Nugroho (2306212745)
 * Fadhlureza Sebastian (2306161971)
 * Rivi Yasha Hafizhan (2306250535)
 
# Cara Menjalankan Aplikasi dengan Docker

## Prasyarat

*   Sudah install [Docker](https://www.docker.com/get-started).
*   Sudah install [Docker Compose](https://docs.docker.com/compose/install/).

## Langkah-langkah Menjalankan

1.  **Clone repository ini (jika belum):**
    ```bash
    git clone https://github.com/ssantario/noSQL-Kelas.git
    cd noSQL-Kelas
    ```

2.  **Siapkan Environment Variables:**

    *   **Backend:**
        *   Buat file bernama `.env` di dalam folder `backend`.
        *   Isi file `backend/.env` dengan:
            ```env
            # filepath: backend/.env
            MONGO_URL=connection_string_mongodb
            ```

3.  **Build dan Jalankan Container:**  
    Buka terminal di root proyek lalu jalankan perintah:
    ```bash
    docker compose up --build
    ```
    *   Opsi `--build`: Untuk membangun image Docker sebelum menjalankan container. Bisa dihilangkan jika image sudah pernah di-build.
    *   Opsi `-d`: (Opsional) Tambahkan ini agar container berjalan di background.
        ```bash
        docker compose up --build -d
        ```

4.  **Akses Aplikasi:**

    *   **Frontend:**  
        Buka browser dan akses: `http://localhost:3000`
        (Lihat file `docker-compose.yml` untuk memastikan)

    *   **Backend:**  
        API backend akan berjalan di `http://localhost:4000`
        (Lihat file `docker-compose.yml` untuk memastikan port backend).


5.  **Menghentikan Aplikasi:**
    *   Jika terminal masih menjalankan `docker compose up`, tekan `Ctrl+C`.
    *   Jika berjalan di background (dengan `-d`), gunakan perintah:
        ```bash
        docker compose down
        ```


# SIRSak UI - Sistem Informasi Akademis Universitas Indonesia

SIRSak UI adalah aplikasi berbasis web yang digunakan untuk mengelola berbagai informasi akademis di Universitas Indonesia. Aplikasi ini memungkinkan pengelolaan data mahasiswa, mata kuliah, pendaftaran, dan jadwal kuliah dengan antarmuka yang mudah digunakan.

## Fitur Utama:

### 1. **Manage Students**

Fitur ini memungkinkan pengelolaan data mahasiswa, termasuk menambah, memperbarui, dan melacak informasi mahasiswa. Kita bisa melihat data seperti nama, NPM, jurusan, IPK, dan semester mahasiswa.

### 2. **Manage Courses**

Fitur ini digunakan untuk membuat dan mengelola mata kuliah yang tersedia di Universitas Indonesia. Pengguna dapat menambahkan informasi seperti kode mata kuliah, nama mata kuliah, dan jumlah SKS (Satuan Kredit Semester).

### 3. **Manage Enrollments**

Fitur ini digunakan untuk melacak pendaftaran mata kuliah oleh mahasiswa. Data yang tercatat termasuk mahasiswa yang terdaftar, mata kuliah yang diambil, nilai yang diperoleh, serta tanggal pendaftaran.

### 4. **Manage Schedule**

Dengan fitur ini, pengelola akademik dapat mengatur jadwal mata kuliah, waktu perkuliahan, serta penjadwalan ruang kuliah. Hal ini bertujuan untuk memudahkan pengelolaan jadwal bagi mahasiswa dan pengajar.

## Statistik SIRSAK UI
Pada halaman utama, terdapat *Quick Stats* yang menunjukkan statistik singkat mengenai jumlah mahasiswa, mata kuliah aktif, serta pendaftaran.
![image](https://hackmd.io/_uploads/r1-ksm77ee.png)
