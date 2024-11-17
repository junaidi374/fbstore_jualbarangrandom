// Fungsi untuk membuka modal produk
function bukaModalProduk(id, title, description, price, image, video) {
    const modal = document.getElementById('productModal');
    
    // Atur gambar, judul, dan deskripsi produk
    document.getElementById('modalImage').src = image;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;

    // Format harga produk dan set harga modal
    const hargaProduk = parseInt(price.replace(/[^0-9]/g, ''));
    document.getElementById('modalPrice').textContent = `Rp ${hargaProduk}`;

    // Perbarui total harga dan tautan checkout
    perbaruiTotalHarga(hargaProduk);
    perbaruiTautanCheckout(hargaProduk, 1); // Jumlah awal = 1

    modal.style.display = "block";

    // Event listener untuk tombol tambah (+) dan kurang (-) jumlah
    document.getElementById('quantityWrapper').addEventListener('click', (event) => {
    const quantityInput = document.getElementById('quantity');
    let currentQuantity = parseInt(quantityInput.value);

    if (event.target.classList.contains('tambah')) {
        currentQuantity++;  // Menambah jumlah
    } else if (event.target.classList.contains('kurangi')) {
        if (currentQuantity > 1) {
            currentQuantity--;  // Mengurangi jumlah jika lebih dari 1
        }
    }

    quantityInput.value = currentQuantity;  // Update value input jumlah
    const hargaProduk = parseInt(document.getElementById('modalPrice').textContent.replace(/[^0-9]/g, ''));
    perbaruiTotalHarga(hargaProduk, currentQuantity);  // Update total harga berdasarkan jumlah baru
});

    // Event listener untuk tombol checkout
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        window.open(document.getElementById('checkoutBtn').href, '_blank');
    });

    // Event listener untuk tombol "Tambah ke Keranjang"
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        tambahkanKeKeranjang(id, title, price, image);
    });
}

// Fungsi untuk memperbarui total harga
function perbaruiTotalHarga(hargaProduk, jumlah = 1) {
    const totalHarga = hargaProduk * jumlah;
    document.getElementById('totalPrice').textContent = `Total: Rp ${totalHarga}`;
    perbaruiTautanCheckout(hargaProduk, jumlah);
}

// Fungsi untuk memperbarui tautan checkout
function perbaruiTautanCheckout(hargaProduk, jumlah) {
    const title = document.getElementById('modalTitle').textContent;
    const totalHarga = hargaProduk * jumlah;
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Buat URL checkout WhatsApp
    checkoutBtn.href = `https://wa.me/+628152811570?text=Checkout%20Produk:%20${encodeURIComponent(title)}%20Jumlah:%20${jumlah}%20Total%20Harga:%20Rp%20${totalHarga}`;
}

// Fungsi untuk menambahkan produk ke keranjang
function tambahkanKeKeranjang(id, title, price, image) {
    let keranjang = JSON.parse(localStorage.getItem('cart')) || [];

    // Cek apakah produk sudah ada di keranjang
    const indeksProduk = keranjang.findIndex(item => item.id === id);
    if (indeksProduk !== -1) {
        keranjang[indeksProduk].quantity++;
    } else {
        keranjang.push({ id, title, price: parseInt(price.replace(/[^0-9]/g, '')), image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(keranjang));
    perbaruiIkonKeranjang();
}

// Fungsi untuk memperbarui ikon keranjang
function perbaruiIkonKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem('cart')) || [];
    const ikonKeranjang = document.getElementById('cartIcon');
    ikonKeranjang.textContent = `shopping_cart ${keranjang.length}`;
}

// Fungsi untuk menghapus item dari keranjang
function hapusDariKeranjang(indeks) {
    let keranjang = JSON.parse(localStorage.getItem('cart')) || [];
    keranjang.splice(indeks, 1); // Hapus item berdasarkan indeks
    localStorage.setItem('cart', JSON.stringify(keranjang));
    perbaruiTampilanKeranjang();
    perbaruiIkonKeranjang();
}

// Fungsi untuk menambah jumlah item di keranjang
function tambahJumlahItem(indeks) {
    let keranjang = JSON.parse(localStorage.getItem('cart')) || [];
    keranjang[indeks].quantity++;
    localStorage.setItem('cart', JSON.stringify(keranjang));
    perbaruiTampilanKeranjang();
}

// Fungsi untuk mengurangi jumlah item di keranjang
function kurangiJumlahItem(indeks) {
    let keranjang = JSON.parse(localStorage.getItem('cart')) || [];
    if (keranjang[indeks].quantity > 1) {
        keranjang[indeks].quantity--;
    } else {
        hapusDariKeranjang(indeks);
    }
    localStorage.setItem('cart', JSON.stringify(keranjang));
    perbaruiTampilanKeranjang();
}

// Fungsi untuk memperbarui tampilan keranjang
function perbaruiTampilanKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem('cart')) || [];
    const kontainerItemKeranjang = document.getElementById('cartItems');
    const kontainerTotalKeranjang = document.getElementById('cartTotal');

    // Kosongkan isi keranjang sebelum menambah item baru
    kontainerItemKeranjang.innerHTML = '';

    // Tambahkan item ke keranjang
    keranjang.forEach((item, indeks) => {
        const itemKeranjang = document.createElement('div');
        itemKeranjang.classList.add('cart-item');
        itemKeranjang.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image" />
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>Harga: Rp ${item.price}</p>
                <p>Jumlah: 
                    <button class="kurangi" data-indeks="${indeks}">-</button>
                    ${item.quantity}
                    <button class="tambah" data-indeks="${indeks}">+</button>
                </p>
                <p>Subtotal: Rp ${item.price * item.quantity}</p>
                <button class="hapus" data-indeks="${indeks}">Hapus</button>
            </div>
        `;
        kontainerItemKeranjang.appendChild(itemKeranjang);
    });

    // Hitung total harga
    const totalHarga = keranjang.reduce((sum, item) => sum + item.price * item.quantity, 0);
    kontainerTotalKeranjang.textContent = `Total: Rp ${totalHarga}`;

    // Buat pesan detail produk untuk checkout
    const detailProduk = keranjang.map(item => `${item.title} (Jumlah: ${item.quantity})`).join(', ');
    document.getElementById('checkoutCartBtn').href = `https://wa.me/+628152811570?text=Checkout%20Keranjang%20Belanja:%20${encodeURIComponent(detailProduk)}%20Total%20Harga:%20Rp%20${totalHarga}`;
}

// Event untuk menutup modal produk
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('productModal').style.display = "none";
});

// Tombol Kembali ke halaman sebelumnya
document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
});

// Buka modal produk jika data tersedia di URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const title = urlParams.get('title');
const description = urlParams.get('description');
const price = urlParams.get('price');
const image = urlParams.get('image');
const video = urlParams.get('video');

// Jika data produk ada, buka modal produk
if (title && description && price && image) {
    bukaModalProduk(id, title, description, price, image, video);
}

// Perbarui ikon keranjang saat halaman dimuat
perbaruiIkonKeranjang();

// Event untuk membuka modal keranjang
document.getElementById('cartIcon').addEventListener('click', () => {
    const modalKeranjang = document.getElementById('cartModal');
    modalKeranjang.style.display = 'block';
    perbaruiTampilanKeranjang();
});

// Event untuk menutup modal keranjang
document.getElementById('closeCartModal').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
});

// Event delegation untuk tombol hapus, tambah, kurangi
document.getElementById('cartItems').addEventListener('click', (event) => {
    if (event.target.classList.contains('hapus')) {
        const indeks = event.target.getAttribute('data-indeks');
        hapusDariKeranjang(indeks);
    } else if (event.target.classList.contains('tambah')) {
        const indeks = event.target.getAttribute('data-indeks');
        tambahJumlahItem(indeks);
    } else if (event.target.classList.contains('kurangi')) {
        const indeks = event.target.getAttribute('data-indeks');
        kurangiJumlahItem(indeks);
    }
});
