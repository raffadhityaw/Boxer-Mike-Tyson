
        // MEMASTIKAN KODE JAVASCRIPT BERJALAN HANYA SETELAH SELURUH STRUKTUR HTML SELESAI DIMUAT
document.addEventListener('DOMContentLoaded', function() {
    
    // MENDAPATKAN REFERENSI (HOOK) KE ELEMEN-ELEMEN HTML YANG AKAN DIMAIPULASI
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    // MENDIFINISIKAN URL GAMBAR STATUS UNTUK KONDISI BERBEDA
    const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**FUNGSI UNTUK MENGUBAH GAMBAR STATUS (statusImage) BERDASARKAN PARAMETER YANG DITERIMA ('normal', 'success', atau 'error')*/
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            // MERESET GAMBAR STATUS KE KONDISI NORMAL (DEFAULT)
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**FUNGSI UNTUK MEMBERSIHKAN (MENGOSONGKAN) TAMPILAN DISPLAY DAN MERESET GAMBAR STATUS*/
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar
    }

    /**FUNGSI UNTUK MENGHAPUS SATU KARAKTER TERAKHIR PADA TAMPILAN DISPLAY*/
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**FUNGSI UNTUK MENAMBAHKAN NILAI TOMBOL (ANGKA ATAU OPERATOR) KE AKHIR STRING DISPLAY*/
    function appendToDisplay(value) {
        display.value += value;
    }

    /**FUNGSI UTAMA UNTUK MENGHITUNG EKSPRESI MATEMATIKA YANG ADA DI DISPLAY*/
    function calculateResult() {
        // MEMERIKSA APAKAH DISPLAY KOSONG SEBELUM MELAKUKAN PERHITUNGAN
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            // MENJALANKAN FUNGSI clearDisplay SETELAH 1.5 DETIK (1500 milidetik)
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            // MENGHITUNG EKSPRESI MENGGUNAKAN FUNGSI EVAL(). OPERATOR % DIGANTI DENGAN '/100'
            let result = eval(display.value
                .replace(/%/g, '/100') // MENGUBAH SEMUA TANDA PERSEN (%) MENJADI OPERASI BAGI SERATUS (/100) AGAR BISA DIHITUNG EVAL()
            ); 
            
            // MEMERIKSA APAKAH HASIL PERHITUNGAN VALID (BUKAN Infinity, NaN, dll.)
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); // MENGUBAH GAMBAR STATUS MENJADI SUKSES
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); // MENGUBAH GAMBAR STATUS MENJADI ERROR
            setTimeout(clearDisplay, 1500);
        }
    }


    // MEMASANG EVENT LISTENER (PENDENGAR KEJADIAN) KE SEMUA TOMBOL KALKULATOR
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            // MEMERIKSA NILAI TOMBOL (data-value) UNTUK MENENTUKAN FUNGSI YANG HARUS DIJALANKAN
            switch(value) {
                case 'C':
                    // MEMANGGIL FUNGSI MEMBERSIHKAN TAMPILAN DAN MERESET STATUS
                    clearDisplay();
                    break;
                case 'DEL':
                    // MEMANGGIL FUNGSI MENGHAPUS KARAKTER TERAKHIR
                    deleteLastChar();
                    break;
                case '=':
                    // MEMANGGIL FUNGSI MENGHITUNG HASIL
                    calculateResult();
                    break;
                default:
                    // MENAMBAHKAN NILAI TOMBOL KE DISPLAY. JIKA SEBELUMNYA ADA STATUS SUKSES/ERROR, DISPLAY DIRESET DULU
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    // MEMASANG EVENT LISTENER UNTUK MENANGANI INPUT MELALUI KEYBOARD
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
            e.preventDefault();
        }
    });

});