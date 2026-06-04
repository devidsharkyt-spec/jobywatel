// Pobierz parametry z URL
var params = new URLSearchParams(window.location.search);

// Obsługa kliknięcia przycisku login
document.querySelector(".login").addEventListener('click', () => {
    toHome();
});

var biometricButton = document.querySelector(".biometric_login");
var biometricStatus = document.querySelector(".biometric_status");

if (biometricButton) {
    biometricButton.addEventListener('click', async () => {
        biometricStatus.textContent = '';

        if (!window.PublicKeyCredential || !navigator.credentials) {
            biometricStatus.textContent = 'Biometria niedostepna na tym urzadzeniu.';
            return;
        }

        try {
            var challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);

            await navigator.credentials.get({
                publicKey: {
                    challenge: challenge,
                    timeout: 60000,
                    userVerification: 'required'
                }
            });

            toHome();
        } catch (error) {
            biometricStatus.textContent = 'Nie udalo sie potwierdzic biometrii.';
        }
    });
}

// Powitanie w zależności od godziny
var welcome = "Dzień dobry!";
var date = new Date();
if (date.getHours() >= 18){
    welcome = "Dobry wieczór!";
}
document.querySelector(".welcome").innerHTML = welcome;

// Funkcja przekierowania do home.html z parametrami
function toHome(){
    sessionStorage.setItem('mobDemoAuthenticated', '1');
    sessionStorage.removeItem('mobDemoHiddenAt');
    location.href = 'home.html?' + params.toString();
}

// Obsługa Enter w polu hasła
var input = document.querySelector(".password_input");
input.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        document.activeElement.blur();
    }
});

// Logika maskowania hasła
var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

input.addEventListener("input", () => {
    var value = input.value.toString();
    var char = value.substring(value.length - 1);

    if (value.length < original.length){
        // Usunięto znak
        original = original.substring(0, original.length - 1);
    } else {
        // Dodano nowy znak
        original = original + char;
    }

    if (!eye.classList.contains("eye_close")){
        var dots = "";
        for (var i = 0; i < value.length - 1; i++){
            dots += dot;
        }
        input.value = dots + char;

        delay(3000).then(() => {
            if (input.value.length !== 0){
                input.value = input.value.substring(0, input.value.length - 1) + dot;
            }
        });
    }
});

// Funkcja delay
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Przełącznik oka
eye.addEventListener('click', () => {
    var classlist = eye.classList;
    if (classlist.contains("eye_close")){
        classlist.remove("eye_close");
        var dots = "";
        for (var i = 0; i < input.value.length; i++){
            dots += dot;
        }
        input.value = dots;
    } else {
        classlist.add("eye_close");
        input.value = original;
    }
});
