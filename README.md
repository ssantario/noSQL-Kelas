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