import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, HelpCircle } from 'lucide-react';

const HelpContact = () => {
  return (
    <div className="min-h-screen p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Help & Contact</h1>
        <p className="text-sm text-gray-600 mt-1">Get assistance with your feedback portal</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Support</p>
                <p className="text-sm text-gray-600">feedback@jntugv.ac.in</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone Support</p>
                <p className="text-sm text-gray-600">+91 12345 67890</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Office Address</p>
                <p className="text-sm text-gray-600">JNTUGV, Vizianagaram, AP - 535003</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm font-medium text-gray-900">How do I submit feedback?</p>
              </div>
              <p className="text-xs text-gray-600 ml-6">Select your semester from the dashboard and complete all feedback forms.</p>
            </div>
            <div>
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm font-medium text-gray-900">Can I edit my submission?</p>
              </div>
              <p className="text-xs text-gray-600 ml-6">No, once submitted, feedback cannot be edited. Please review carefully before submission.</p>
            </div>
            <div>
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm font-medium text-gray-900">Is my feedback anonymous?</p>
              </div>
              <p className="text-xs text-gray-600 ml-6">Yes, all feedback is kept confidential and used only for improvement purposes.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpContact;