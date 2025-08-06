
// Bot Configuration (PRIVATE - Not visible in source)
const BOT_TOKEN = '8404109317:AAFja3eaJHY9RvFoFBtfNSe2aOIjOhMF-pc'; // Replace with your actual bot token
const CHAT_ID = '5836939482'; // Replace with your actual chat ID

// Global variables
let selectedProduct = '';
let selectedPrice = 0;
let backgroundMusic;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Generate unique IDs
    generateOrderId();
    generateTransactionId();
    
    // Initialize snow animation
    createSnowflakes();
    
    // Initialize background music
    initializeMusic();
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        
        // Play background music after loading
        playBackgroundMusic();
    }, 3000);
    
    // Initialize form handlers
    initializeForm();
    
    // Smooth scrolling for navigation
    initializeSmoothScrolling();
}

function createSnowflakes() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakeSymbols = ['❄', '❅', '❆', '⋄', '◆', '◇'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createSnowflake(snowContainer, snowflakeSymbols);
        }, i * 300);
    }
    
    // Continue creating snowflakes
    setInterval(() => {
        createSnowflake(snowContainer, snowflakeSymbols);
    }, 2000);
}

function createSnowflake(container, symbols) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    
    container.appendChild(snowflake);
    
    // Remove snowflake after animation
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.parentNode.removeChild(snowflake);
        }
    }, 6000);
}

function initializeMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.3;
}

function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    }
}

function generateOrderId() {
    const orderId = 'KS' + Date.now().toString().slice(-8);
    document.getElementById('orderId').value = orderId;
}

function generateTransactionId() {
    const transactionId = 'TX' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('transactionId').value = transactionId;
}

function selectProduct(productName, price) {
    selectedProduct = productName;
    selectedPrice = price;
    
    document.getElementById('selectedProduct').value = `${productName} - Rp ${price.toLocaleString('id-ID')}`;
    
    // Scroll to order form
    document.querySelector('.order-section').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Show success message
    showMessage(`Produk "${productName}" telah dipilih!`, 'success');
}

function copyToClipboard(text, method) {
    navigator.clipboard.writeText(text).then(function() {
        showMessage(`Nomor ${method} berhasil disalin: ${text}`, 'success');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        showMessage('Gagal menyalin nomor', 'error');
    });
}

function copyQris() {
    // In a real implementation, you would download the QRIS image
    showMessage('QRIS berhasil diunduh!', 'success');
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeForm() {
    const form = document.getElementById('orderForm');
    const imageInput = document.getElementById('proofImage');
    
    // Handle image preview
    imageInput.addEventListener('change', function(e) {
        handleImagePreview(e);
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview Bukti Transfer">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

function handleFormSubmission() {
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Send to Telegram
    sendToTelegram(formData);
}

function validateForm() {
    const requiredFields = ['whatsapp', 'paymentMethod', 'proofImage'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showMessage(`Field ${field.previousElementSibling.textContent} harus diisi!`, 'error');
            isValid = false;
        }
    });
    
    if (!selectedProduct) {
        showMessage('Silakan pilih produk terlebih dahulu!', 'error');
        isValid = false;
    }
    
    return isValid;
}

function collectFormData() {
    return {
        orderId: document.getElementById('orderId').value,
        whatsapp: document.getElementById('whatsapp').value,
        transactionId: document.getElementById('transactionId').value,
        product: selectedProduct,
        price: selectedPrice,
        paymentMethod: document.getElementById('paymentMethod').value,
        proofImage: document.getElementById('proofImage').files[0]
    };
}

async function sendToTelegram(formData) {
    try {
        showMessage('Mengirim pesanan ke Telegram...', 'info');
        
        // Prepare message text
        const messageText = `
🛍️ *PESANAN BARU - KIRYZZ STORE*

📋 *Detail Pesanan:*
🆔 ID Pesanan: \`${formData.orderId}\`
📱 WhatsApp: ${formData.whatsapp}
🔢 ID Transaksi: \`${formData.transactionId}\`
🎯 Produk: ${formData.product}
💰 Harga: Rp ${formData.price.toLocaleString('id-ID')}
💳 Metode Pembayaran: ${formData.paymentMethod}

⏰ Waktu Order: ${new Date().toLocaleString('id-ID')}

✅ Bukti transfer telah diunggah
        `;
        
        // Send message to Telegram
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown'
            })
        });
        
        if (response.ok) {
            showMessage('Pesanan berhasil dikirim ke Telegram! Kami akan segera memproses pesanan Anda.', 'success');
            resetForm();
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        showMessage('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi atau hubungi customer service.', 'error');
    }
}

function resetForm() {
    document.getElementById('orderForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    selectedProduct = '';
    selectedPrice = 0;
    generateOrderId();
    generateTransactionId();
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}-message`;
    messageEl.textContent = message;
    
    // Insert message at the top of the form
    const form = document.getElementById('orderForm');
    form.insertBefore(messageEl, form.firstChild);
    
    // Auto remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Payment method quick copy buttons
function copyDanaNumber() {
    copyToClipboard('085123456789', 'DANA');
}

function copyOvoNumber() {
    copyToClipboard('085123456789', 'OVO');
}

function copyGopayNumber() {
    copyToClipboard('085123456789', 'GoPay');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Add some interactive features
document.addEventListener('mousemove', function(e) {
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        hero.style.backgroundPosition = `${50 + x * 5}% ${50 + y * 5}%`;
    }
});

// Add scroll effects
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Add product card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add loading animation to buttons
function addButtonLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Call tooltip initialization
document.addEventListener('DOMContentLoaded', initializeTooltips);

console.log('🛍️ Kiryzz Store loaded successfully!');
console.log('🎵 Background music initialized');
console.log('❄️ Snow animation started');
console.log('📱 Telegram integration ready');
