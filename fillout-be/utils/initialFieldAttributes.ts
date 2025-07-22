import type { BaseFieldAttributes } from '../types/componentTypes'

const initialFieldAttributes: Record<string, BaseFieldAttributes> = {
  EmailInput: {
    text: 'Email',
    ariaLabel: 'email-input',
    placeholder: '',
  },
  ShortAnswerInput: {
    text: 'Type your question here',
    ariaLabel: 'short-text-input',
    placeholder: '',
  }
};

export default initialFieldAttributes