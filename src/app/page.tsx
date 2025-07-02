import EmailInput from "@/app/formComponents/EmailInput"
import ShortAnswerInput from "@/app/formComponents/ShortAnswerInput"

export default function Home() {
  return (
    <div className="">
      <div>
        <EmailInput text="Email" label="Email" placeholder="Enter your email" formMode='edit' />
        <ShortAnswerInput text="Short Answer" label="Short Answer" placeholder="Enter your short answer" />
      </div>
    </div>
  )
}
