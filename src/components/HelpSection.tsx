'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I switch between Mentee and Mentor mode?',
    answer: 'Click on the status toggle buttons in your profile card. You can switch anytime between Mentee (learning mode) and Mentor (teaching mode) based on your current goals.',
  },
  {
    question: 'How does the AI matching system work?',
    answer: 'Our AI analyzes your skills, course, hobbies, and grade level to find the best matches. The compatibility score shows how well you align with potential mentors or mentees.',
  },
  {
    question: 'How do I earn badges?',
    answer: 'Complete your profile, make connections, participate in mentorship sessions, and receive positive reviews to unlock various badges and achievements.',
  },
  {
    question: 'Can I add custom skills to my expertise?',
    answer: 'Yes! You can add any skill manually or use our AI-powered suggestions based on your course and hobbies.',
  },
  {
    question: 'How do I update my profile picture?',
    answer: 'Hover over your profile picture and click the camera icon that appears. You can then upload a new image.',
  },
];

export default function HelpSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900 text-left">
                  {faq.question}
                </span>
                {openFaqIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Need More Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="w-5 h-5 text-indigo-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Email Support</p>
              <p className="text-sm text-gray-500">support@studyquest.com</p>
            </div>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Live Chat</p>
              <p className="text-sm text-gray-500">Chat with AI assistant</p>
            </div>
          </button>
        </div>
      </div>

      {/* Tutorial Links */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Tutorials & Guides
        </h3>
        <div className="space-y-2">
          <a
            href="#"
            className="block p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            📚 Getting Started Guide
          </a>
          <a
            href="#"
            className="block p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            🎯 How to Find the Perfect Mentor
          </a>
          <a
            href="#"
            className="block p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            🏆 Earning Badges and Achievements
          </a>
          <a
            href="#"
            className="block p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            💡 Best Practices for Mentorship
          </a>
        </div>
      </div>
    </div>
  );
}
