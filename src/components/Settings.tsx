'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import ProfileEditor from './ProfileEditor';
import HelpSection from './HelpSection';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'help'>('profile');
  const profile = useUserStore((s) => s.profile);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                  <div className="flex items-center space-x-3">
                    <SettingsIcon className="w-6 h-6 text-indigo-600" />
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      Settings
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'profile'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Profile Settings</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('help')}
                      className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'help'
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="w-5 h-5" />
                        <span>Help</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {activeTab === 'profile' && <ProfileEditor onClose={onClose} />}
                  {activeTab === 'help' && <HelpSection />}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
