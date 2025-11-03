# Email Configuration Guide

This project uses Nodemailer for sending emails. You need to configure your email service in the `.env` file.

## Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@eventmanagement.com
EMAIL_FROM_NAME=Event Management
```

## Email Provider Setup

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Event Management
```

### Option 2: Mailtrap (Recommended for Testing)

Mailtrap is perfect for testing - emails are caught and displayed in a dashboard instead of being sent.

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create an inbox
3. Copy the SMTP credentials

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@eventmanagement.com
EMAIL_FROM_NAME=Event Management
```

### Option 3: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Use the SMTP settings

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USERNAME=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Event Management
```

### Option 4: AWS SES

1. Set up AWS SES
2. Get SMTP credentials

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USERNAME=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Event Management
```

### Option 5: Custom SMTP Server

For any other SMTP server:

```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USERNAME=your-username
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Event Management
```

## Email Templates

The following emails are automatically sent:

1. **Welcome Email** - Sent when a user signs up
2. **Password Reset** - Sent when a user requests password reset
3. **Booking Confirmation** - Sent when a booking is created
4. **Booking Cancellation** - Sent when a booking is cancelled

## Testing

For development and testing, use Mailtrap to avoid sending real emails and see all emails in a dashboard.

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords for Gmail (not your regular password)
- For production, use a professional email service (SendGrid, AWS SES, etc.)
- Store credentials securely using environment variables

