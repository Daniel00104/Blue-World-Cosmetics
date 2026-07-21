document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form || !status || !submitButton) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        status.className = 'form-status';
        status.textContent = '';

        const publicKey = 'abc123xyz...';
        const serviceId = 'service_abc123';
        const templateId = 'template_xyz789';
        const recipientEmail = 'danielokeke2004@gmail.com';

        if (!window.emailjs) {
            status.textContent = 'Email service is unavailable right now.';
            status.className = 'form-status error';
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }

        if (publicKey.includes('YOUR_') || serviceId.includes('YOUR_') || templateId.includes('YOUR_')) {
            status.textContent = 'EmailJS is not configured yet. Please fill in your EmailJS credentials in js/contact.js.';
            status.className = 'form-status error';
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }

        try {
            emailjs.init({ publicKey });

            const name = form.from_name.value.trim();
            const email = form.from_email.value.trim();
            const subject = form.subject.value.trim();
            const message = form.message.value.trim();
            const subjectLine = `New Contact Request: ${subject || 'No subject provided'}`;

            const templateParams = {
                from_name: name,
                from_email: email,
                reply_to: email,
                subject: subjectLine,
                message: message,
                message_body: [
                    `Name: ${name}`,
                    `Email: ${email}`,
                    `Subject: ${subject || 'No subject provided'}`,
                    '',
                    'Message:',
                    message
                ].join('\n'),
                message_html: `
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `,
                to_email: recipientEmail,
                company_name: 'Blueworld Cosmetics'
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            status.textContent = 'Thank you! Your message has been sent successfully.';
            status.className = 'form-status success';
            form.reset();
        } catch (error) {
            console.error('EmailJS error:', error);
            status.textContent = 'Something went wrong. Please try again later.';
            status.className = 'form-status error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});
