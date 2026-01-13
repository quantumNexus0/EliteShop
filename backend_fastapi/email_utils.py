import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_order_confirmation_email(to_email: str, order_id: str, total_amount: float, items: list):
    """
    Sends an order confirmation email.
    If SMTP credentials are not set, logs the email to console.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    sender_email = os.getenv("SENDER_EMAIL", smtp_user)

    subject = f"Order Confirmation - Order #{order_id[:8]}"
    
    # Construct Plain Text Body
    body = f"""
    Thank you for your order!
    
    Order ID: {order_id}
    Total Amount: ${total_amount:.2f}
    
    Items:
    """
    for item in items:
        # Assuming item is a dict or object with name/quantity/price
        # In create_order, we only have product_id, quantity, price. 
        # Ideally we would look up names, but for now let's show basics.
        body += f"- Product ID: {item.product_id}, Qty: {item.quantity}, Price: ${item.price:.2f}\n"

    body += "\nWe will notify you when your order is shipped."

    # HTML Body
    html_body = f"""
    <html>
      <body>
        <h2>Thank you for your order!</h2>
        <p><strong>Order ID:</strong> {order_id}</p>
        <p><strong>Total Amount:</strong> ${total_amount:.2f}</p>
        <h3>Items:</h3>
        <ul>
    """
    for item in items:
        html_body += f"<li>Product ID: {item.product_id}, Qty: {item.quantity}, Price: ${item.price:.2f}</li>"
    
    html_body += """
        </ul>
        <p>We will notify you when your order is shipped.</p>
      </body>
    </html>
    """

    if not smtp_user or not smtp_password:
        print("---------------------------------------------------")
        print(f"MOCK EMAIL TO: {to_email}")
        print(f"SUBJECT: {subject}")
        print(body)
        print("---------------------------------------------------")
        print("To send real emails, set SMTP_USER and SMTP_PASSWORD environment variables.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = to_email

        part1 = MIMEText(body, "plain")
        part2 = MIMEText(html_body, "html")

        msg.attach(part1)
        msg.attach(part2)

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
