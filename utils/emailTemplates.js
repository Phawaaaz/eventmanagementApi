exports.passwordReset = (resetURL, name) => {
  return {
    subject: 'Password Reset Request (Valid for 10 minutes)',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>You recently requested to reset your password for your Event Management account. Click the button below to reset it:</p>
              <a href="${resetURL}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4CAF50;">${resetURL}</p>
              <p><strong>This password reset link is valid for only 10 minutes.</strong></p>
              <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>Best regards,<br>The Event Management Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    message: `
      Password Reset Request
      
      Hello ${name},
      
      You recently requested to reset your password. Use the link below to reset it:
      
      ${resetURL}
      
      This password reset link is valid for only 10 minutes.
      
      If you did not request a password reset, please ignore this email.
      
      Best regards,
      The Event Management Team
    `,
  };
};

exports.welcomeEmail = (name) => {
  return {
    subject: 'Welcome to Event Management!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Event Management!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for signing up with Event Management! We're excited to have you on board.</p>
              <p>You can now:</p>
              <ul>
                <li>Browse and discover amazing events</li>
                <li>Book tickets for your favorite events</li>
                <li>Share your experiences by leaving reviews</li>
                <li>Manage your bookings and profile</li>
              </ul>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Happy event planning!</p>
              <p>Best regards,<br>The Event Management Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    message: `
      Welcome to Event Management!
      
      Hello ${name},
      
      Thank you for signing up with Event Management! We're excited to have you on board.
      
      You can now browse events, book tickets, leave reviews, and manage your profile.
      
      Happy event planning!
      
      Best regards,
      The Event Management Team
    `,
  };
};

exports.bookingConfirmation = (booking, event, name) => {
  return {
    subject: `Booking Confirmation - ${event.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .booking-details {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Your booking has been confirmed! Here are the details:</p>
              <div class="booking-details">
                <h2>${event.name}</h2>
                <div class="detail-row">
                  <span class="detail-label">Event Date:</span>
                  <span>${new Date(event.date).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span>${event.location}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Seats:</span>
                  <span>${booking.numSeats}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Price:</span>
                  <span>$${booking.price.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>${booking._id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span style="color: #4CAF50; font-weight: bold;">${booking.status.toUpperCase()}</span>
                </div>
              </div>
              <p>Please save this email for your records. We look forward to seeing you at the event!</p>
              <p>Best regards,<br>The Event Management Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    message: `
      Booking Confirmation
      
      Hello ${name},
      
      Your booking has been confirmed!
      
      Event: ${event.name}
      Date: ${new Date(event.date).toLocaleString()}
      Location: ${event.location}
      Seats: ${booking.numSeats}
      Total Price: $${booking.price.toFixed(2)}
      Booking ID: ${booking._id}
      Status: ${booking.status.toUpperCase()}
      
      Please save this email for your records.
      
      Best regards,
      The Event Management Team
    `,
  };
};

exports.bookingCancellation = (booking, event, name) => {
  return {
    subject: `Booking Cancelled - ${event.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #f44336;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .booking-details {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-label {
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Your booking has been cancelled. Details of the cancelled booking:</p>
              <div class="booking-details">
                <h2>${event.name}</h2>
                <div class="detail-row">
                  <span class="detail-label">Event Date:</span>
                  <span>${new Date(event.date).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span>${event.location}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Seats:</span>
                  <span>${booking.numSeats}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>${booking._id}</span>
                </div>
              </div>
              <p>If you have any questions or if this cancellation was made in error, please contact our support team.</p>
              <p>Best regards,<br>The Event Management Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    message: `
      Booking Cancelled
      
      Hello ${name},
      
      Your booking has been cancelled.
      
      Event: ${event.name}
      Date: ${new Date(event.date).toLocaleString()}
      Location: ${event.location}
      Seats: ${booking.numSeats}
      Booking ID: ${booking._id}
      
      If you have any questions, please contact our support team.
      
      Best regards,
      The Event Management Team
    `,
  };
};

