document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const correo = document.querySelector('input[name="correo"]').value;
    const contrasena = document.querySelector('input[name="contrasena"]').value;
    console.log("Sending data:", { correo, contrasena })

    if(correo == "Jaime" && contrasena == "1234") {
        document.getElementById("login-message").innerText = "Datos verificados correctamente.";
        setTimeout(() => { window.location.href = "coursescreen.html"; }, 500); // Redirect after 0.5s
    }


    /*
    fetch("http://capacitatec.whirlpool.com:3000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from API:", data);
        if (data.success) {
            console.log("Redirecting to coursescreen.html...")
            document.getElementById("login-message").innerText = "Datos verificados correctamente.";
            setTimeout(() => { window.location.href = "http://inicio.capacitatec.whirlpool.com"; }, 500); // Redirect after 0.5s
        } else {
            document.getElementById("login-message").innerText = "Error al verificar los datos.";
        }
    })
    .catch(error => console.error("Error:", error));
    */
});