class ContactMailer < ActionMailer::Base
  default from: "barullocouk@gmail.com"
  
  def contact_email(message)
    @message= message
    mail(:from => @message.email, :to => "barullocouk@gmail.com",
        :subject => @message.subject )
  end
end
