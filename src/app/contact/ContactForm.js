'use client';

import React, { useState } from 'react';
import { sendContact } from '@/stores/pageAPI';

const INPUT_CLASS =
  'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1.5';
const ERROR_CLASS = 'text-red-500 text-sm mt-1';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Inquiry',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    else if (form.name.length > 60) next.name = 'Name must be at most 60 characters';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    else if (form.phone.replace(/\D/g, '').length < 11) next.phone = 'Phone must be at least 11 digits';
    if (!form.message.trim()) next.message = 'Message is required';
    if (form.subject.length > 191) next.subject = 'Subject must be at most 191 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setStatus('sending');
    try {
      const body = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        subject: form.subject?.trim() || 'Inquiry',
      };
      if (form.email?.trim()) body.email = form.email.trim();

      const response = await sendContact(body);
      const ok = response && response.status >= 200 && response.status < 300;

      if (ok) {
        setStatus('success');
        setForm({ name: '', phone: '', email: '', subject: 'Inquiry', message: '' });
        setErrors({});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            maxLength={61}
            className={`${INPUT_CLASS} ${errors.name ? 'border-red-400' : ''}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <p id="name-error" className={ERROR_CLASS}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-phone" className={LABEL_CLASS}>
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 01XXXXXXXXX"
            className={`${INPUT_CLASS} ${errors.phone ? 'border-red-400' : ''}`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && <p id="phone-error" className={ERROR_CLASS}>{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={LABEL_CLASS}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className={LABEL_CLASS}>
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Inquiry"
          maxLength={192}
          className={`${INPUT_CLASS} ${errors.subject ? 'border-red-400' : ''}`}
          aria-invalid={!!errors.subject}
        />
        {errors.subject && <p className={ERROR_CLASS}>{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help?"
          rows={5}
          className={`${INPUT_CLASS} resize-none ${errors.message ? 'border-red-400' : ''}`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <p id="message-error" className={ERROR_CLASS}>{errors.message}</p>}
      </div>

      {status === 'success' && (
        <p className="text-green-600 text-sm font-medium" role="status">
          Message sent. We’ll get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm font-medium" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-60 transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
