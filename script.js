document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    if (nombre && email && mensaje) {
        alert('¡Gracias por tu mensaje, ' + nombre + '! Nos pondremos en contacto contigo pronto.');
        
        // Limpiar el formulario después de enviar
        document.getElementById('contact-form').reset();
    } else {
        alert('Por favor, completa todos los campos del formulario.');
    }
});
