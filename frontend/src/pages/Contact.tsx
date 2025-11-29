import { Mail, Phone, MapPin } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import './Contact.css';

const Contact = () => {
  const { success } = useNotification();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Message sent! Thank you for contacting us. We will get back to you soon.');
  };

  return (
    <div className="contact-page">
      <div className="container contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-description">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contact-info-grid">
          <div className="contact-info-item">
            <div className="contact-info-icon">
              <Mail />
            </div>
            <h3 className="contact-info-title">Email</h3>
            <p className="contact-info-value">contact@campify.tn</p>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <Phone />
            </div>
            <h3 className="contact-info-title">Phone</h3>
            <p className="contact-info-value">+216 55 555 555</p>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <MapPin />
            </div>
            <h3 className="contact-info-title">Office</h3>
            <p className="contact-info-value">Ariana, Tunisia</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Your name" required />
              </div>
              <div className="contact-form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="your.email@example.com" required />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="subject">Subject</label>
              <input id="subject" type="text" placeholder="How can we help?" required />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} required/>
            </div>

            <button type="submit" className="contact-submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;