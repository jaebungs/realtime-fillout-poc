import { FormComponent } from '@/app/types/formComponent'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { FormMode } from '@/app/types/formMode'

export const renderComponent = (component: FormComponent, formMode: FormMode) => {
    switch(component.componentName) {
        case 'EmailInput':
            return <EmailInput 
                text="Email" 
                label="Email" 
                placeholder="Enter your email" 
                formMode={formMode} 
            />
        case 'ShortAnswerInput':
            return <ShortAnswerInput 
                text="Short Answer" 
                ariaLabel="Short Answer" 
                placeholder="Enter your short answer" 
                formMode={formMode} 
            />
        default:
            return null
    }
}
