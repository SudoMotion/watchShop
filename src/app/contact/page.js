import React from 'react';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-xl mx-auto px-4">
        <ContactForm />
      </div>
    </div>
  );
}
