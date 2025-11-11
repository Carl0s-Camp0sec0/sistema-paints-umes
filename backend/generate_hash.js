// ==============================================
// GENERADOR DE HASH BCRYPT CORRECTO
// Script para generar el hash correcto de "admin123"
// ==============================================

const bcrypt = require('bcrypt');

async function generateHash() {
    try {
        // Password a hashear
        const password = 'admin123';
        
        // Generar hash con 12 rounds (igual que en el backend)
        const hash = await bcrypt.hash(password, 12);
        
        console.log('='.repeat(50));
        console.log('🔐 HASH GENERATOR - Sistema Paints');
        console.log('='.repeat(50));
        console.log('Password:', password);
        console.log('Hash generado:', hash);
        console.log('='.repeat(50));
        
        // Verificar que el hash funciona
        const isValid = await bcrypt.compare(password, hash);
        console.log('✅ Verificación:', isValid ? 'CORRECTO' : 'ERROR');
        
        // Generar SQL para actualizar
        console.log('\n📝 SQL para actualizar:');
        console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE username = 'admin';`);
        
        return hash;
        
    } catch (error) {
        console.error('❌ Error generando hash:', error);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    generateHash();
}

module.exports = { generateHash };