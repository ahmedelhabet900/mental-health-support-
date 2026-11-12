// export const getOtpEmailHtml = (otp) => {
//   return `
//   <!DOCTYPE html>
//   <html lang="ar" dir="rtl">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>كود التفعيل</title>
//   </head>
//   <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Tahoma, Arial, sans-serif;">
//     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:32px 0;">
//       <tr>
//         <td align="center">
//           <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

//             <!-- Header -->
//             <tr>
//               <td style="background-color:#4f46e5; padding:28px 32px; text-align:center;">
//                 <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">
//                   Saraha App
//                 </h1>
//               </td>
//             </tr>

//             <!-- Body -->
//             <tr>
//               <td style="padding:32px; text-align:center;">
//                 <h2 style="margin:0 0 12px; color:#111827; font-size:20px;">
//                   أهلاً بيك 👋
//                 </h2>
//                 <p style="margin:0 0 24px; color:#4b5563; font-size:15px; line-height:1.7;">
//                   استخدم الكود ده عشان تفعّل حسابك، الكود صالح لمدة 5 دقايق بس:
//                 </p>

//                 <!-- OTP Box -->
//                 <div style="display:inline-block; background-color:#f4f4f7; border:2px dashed #4f46e5; border-radius:10px; padding:16px 32px; margin-bottom:24px;">
//                   <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#4f46e5;">
//                     ${otp}
//                   </span>
//                 </div>

//                 <p style="margin:0; color:#9ca3af; font-size:13px; line-height:1.6;">
//                   لو إنت مطلبتش الكود ده، تجاهل الإيميل ده ببساطة.
//                 </p>
//               </td>
//             </tr>

//             <!-- Footer -->
//             <tr>
//               <td style="background-color:#f9fafb; padding:20px 32px; text-align:center;">
//                 <p style="margin:0; color:#9ca3af; font-size:12px;">
//                   © ${new Date().getFullYear()} Miora — جميع الحقوق محفوظة
//                 </p>
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
//   </html>
//   `;
// };
export const getOtpEmailHtml = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>كود التفعيل</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Tahoma, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fb; padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

            <tr>
              <td style="background-color:#1d3ed8; padding:28px 32px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">
                  ميورا | MIORA
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:32px; text-align:center;">
                <h2 style="margin:0 0 12px; color:#111827; font-size:20px;">
                  أهلاً بيك في ميورا
                </h2>
                <p style="margin:0 0 24px; color:#4b5563; font-size:15px; line-height:1.7;">
                  اكتب الكود ده في صفحة التفعيل عشان تكمل إنشاء حسابك، والكود صالح لمدة 5 دقايق بس:
                </p>

                <div style="display:inline-block; background-color:#f4f6fb; border:2px dashed #1d3ed8; border-radius:10px; padding:16px 32px; margin-bottom:24px;">
                  <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#1d3ed8;">
                    ${otp}
                  </span>
                </div>

                <p style="margin:0; color:#9ca3af; font-size:13px; line-height:1.6;">
                  لو إنت مطلبتش الكود ده، تجاهل الإيميل ده ببساطة.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background-color:#f9fafb; padding:20px 32px; text-align:center;">
                <p style="margin:0 0 6px; color:#9ca3af; font-size:12px;">
                  © ${new Date().getFullYear()} ميورا — مشروع تخرج
                </p>
                <p style="margin:0; color:#9ca3af; font-size:12px;">
                  ميورا لا يحل محل التشخيص أو العلاج المتخصص
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};