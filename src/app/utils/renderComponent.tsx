import { FormComponent } from '@/app/types/formComponent'
import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"
import { FormMode } from '@/app/types/formMode'

export const renderComponent = (component: FormComponent, formMode: FormMode) => {
    switch(component.componentName) {
        case 'EmailInput':
            return <EmailInput
                id={component.id}
                text={component.text}
                ariaLabel={component.ariaLabel}
                placeholder={component.placeholder}
                formMode={formMode}
            />
        case 'ShortAnswerInput':
            return <ShortAnswerInput 
                id={component.id}
                text={component.text}
                ariaLabel={component.ariaLabel}
                placeholder={component.placeholder}
                formMode={formMode}
            />
        default:
            return null
    }
}
