document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitButton = document.getElementById('submitButton');
    const formMessage = document.getElementById('formMessage');

    // --- 1. COUNTDOWN TIMER LOGIC ---
    // IMPORTANT: Set the correct date and time for the event (Dec 31, 2025, 20:00:00)
    // Month is 0-indexed (December is 11)
    const eventDate = new Date(2025, 11, 31, 20, 0, 0).getTime();
    
    const countdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the elements
        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');

        // If the countdown is finished
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById("countdown").innerHTML = "<div class='timer-unit' style='width:auto;'>ÉVÉNEMENT EN COURS!</div>";
        }
    }, 1000);

    // --- 2. FORM SUBMISSION LOGIC ---
    // IMPORTANT: Replace this URL with your deployed Vercel function endpoint!
    const API_ENDPOINT = '/api/register'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            formMessage.innerHTML = "🚫 Veuillez remplir tous les champs requis pour la réservation divine.";
            formMessage.className = 'form-message error-message';
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'RÉSERVATION EN COURS...';
        formMessage.textContent = 'ENVOI AU CIEL...';
        formMessage.className = 'form-message';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.guests = parseInt(data.guests);
        // Note: The new design simplified the form, so the dressCodeConfirm checkbox is removed from HTML
        // For the Telegram function to work, we'll manually set it to true here.
        data.dressCodeConfirm = true; 

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                formMessage.innerHTML = "🎉 Votre place est assurée! Que cette traversée soit de miracles. Un email est en route.";
                formMessage.className = 'form-message success-message';
                form.reset(); // Clear form on success
            } else {
                const errorData = await response.json();
                formMessage.innerHTML = `⚠️ Échec de la Réserve Divine: ${errorData.message || 'Une erreur inconnue est survenue.'}`;
                formMessage.className = 'form-message error-message';
            }

        } catch (error) {
            console.error('Submission error:', error);
            formMessage.innerHTML = "🔥 Erreur de connexion Céleste. Veuillez réessayer.";
            formMessage.className = 'form-message error-message';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'CONFIRMER MA RÉSERVATION DIVINE';
        }
    });
});