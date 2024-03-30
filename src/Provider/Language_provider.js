import {Alert, ToastAndroid, I18nManager, Platform} from 'react-native';
import {localStorage} from './localStorageProvider';
import AsyncStorage from '@react-native-community/async-storage';
import {config} from './configProvider';
import RNRestart from 'react-native-restart';
import {consolepro} from './Messageconsolevalidationprovider/Consoleprovider';

global.language_key = 1;
class Language_provider {
  language_get = async () => {
    var item = await localStorage.getItemObject('language');
    if (item != null) {
      config.language = item;
    }
    if (item != null) {
      if (item == 0) {
        // I18nManager.forceRTL(false);
        // I18nManager.allowRTL(false);
        //  config.textRotate='left'
        config.textalign = 'left';
        config.inverted = false;
      } else {
        //  I18nManager.forceRTL(true);
        // I18nManager.allowRTL(true);
        config.textalign = 'right';
        // config.textRotate='right'
        config.inverted = true;
      }
      // config.language = item;
    } else {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = 'left';
      // config.textRotate='left'
      config.inverted = false;
      localStorage.setItemObject('language', 0);
      //config.language = 0;
    }
  };

  // language_set = (value) => {
  //   config.language = value;
  //   localStorage.setItemObject('language', value)
  // }

  language_set = async languagem => {
    // var item = await AsyncStorage.getItem('language');
    // localStorage.setItemObject('language', 1)
    if (languagem == 0) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = 'left';
      config.textRotate = 'left';
      config.inverted = false;
      localStorage.setItemObject('language', 0);
      localStorage.removeItem('languagecathc');
      localStorage.removeItem('languagesetenglish');
      config.language = 0;
    } else {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      config.textalign = 'right';
      // config.textRotate='right'
      config.inverted = true;
      localStorage.setItemObject('language', 1);
      localStorage.setItemObject('languagecathc', 0);
      config.language = 1;
    }

    setTimeout(() => {
      RNRestart.Restart();
    }, 500);
  };
  //
  // Media option ///////////////////
  MediaCamera = ['Camera', 'الكاميرا'];
  Mediagallery = ['Gallery', 'صالة عرض'];
  cancelmedia = ['Cancel', 'إلغاء'];
  // Map Provider /////////////////////

  titlesearchlocation = ['Search Location', 'موقع البحث'];

  search_txt = ['Search', 'البحث'];
  // last name====================
  //Otp provider +++++++++++++++++

  Enter_otp = ['Enter Otp', 'أدخل Otp'];
  phoneotp = ['Otp Number', 'رقم OTP'];
  edit = ['Edit', 'تعديل'];
  verificationotp = ['ENTER VERIFICATION', 'أدخل رمز التحقق'];
  code = ['CODE', 'الرمز'];
  verificationcodeheding = [
    'Please enter the verification code',
    'الرجاء إدخال رمز التحقق المرسل',
  ];
  Otp_validation = ['Please enter otp', 'الرجاء إدخال otp'];
  resend = ['Resend OTP', 'إعادة إرسال OTP'];
  verify = ['VERIFY', 'تحقق'];
  Login = ['Log In', 'تسجيل الدخول'];
  emptyName = ['Please enter the name', 'الرجاء إدخال الاسم'];
  NameMinLength = [
    ' Name must be at least 3 characters',
    'يجب ألا يقل الاسم عن 3 أحرف ',
  ];
  NameMaxLength = [
    ' name cannot be more than 50 characters.',
    'لا يسمح أن يكون الاسم أكثر من 50 حرفًا.',
  ];
  validName = ['Enter valid  name', 'أدخل اسمًا صالحًا'];
  //email============================
  emptyEmail = ['Please enter your email', 'الرجاء إدخال البريد الإلكتروني'];
  emailMaxLength = [
    'Email cannot be more than 50 characters',
    'لا يسمح أن يكون البريد الإلكتروني أكثر من 50 حرفًا',
  ];
  validEmail = ['Please enter valid email', 'الرجاء إدخال بريد إلكتروني صحيح'];
  //city============
  emptyCity = ['Please select city', 'برجاء تحديد المدينة'];
  //DOB============
  emptydob = ['Please select date of birth', 'برجاء تحديد تاريخ الميلاد'];
  //DOB============
  emptygender = ['Please select gender', 'يرجى تحديد الجنس'];

  //password=========================
  PasswordSpace = ['Spaces not allow', 'لا يسمح باستخدام المسافات'];
  emptyPassword = ['Please enter password', 'الرجاء إدخال كلمة المرور'];
  PasswordMinLength = [
    'Password must be of minimum 6 characters',
    'يجب ألا تقل كلمة المرور عن 6 أحرف',
  ];
  PasswordMaxLength = [
    'Password cannot be more than 16 characters',
    'لا يسمح أن تكون كلمة المرور أكثر من 16 حرفًا',
  ];
  successUpdatePass = [
    'Password updated successfully',
    'تم تحديث كلمة المرور بنجاح',
  ];
  //cpassword=====================
  // For Confirm Password
  emptyConfirmPWD = ['Please confirm password', 'الرجاء تأكيد كلمة المرور'];
  ConfirmPWDMatch = [
    'Password and confirm password fields must be equal',
    'يجب أن تكون خانة كلمة المرور وتأكيد كلمة المرور متساويان',
  ];
  ConfirmPWDMinLength = [
    'Password confirmation must be at least 6 characters',
    'يجب ألا يقل تأكيد كلمة المرور عن 6 أحرف',
  ];
  ConfirmPWDMaxLength = [
    'Confirm password cannot be more than 16 characters',
    'لا يمكن أن يكون تأكيد كلمة المرور أكثر من 16 حرفًا',
  ];

  //phone no===============
  emptyMobile = ['Please enter Phone number', 'الرجاء إدخال رقم الهاتف'];
  MobileMinLength = [
    'The phone number must be 7 digits at least',
    'يجب ألا يقل رقم الهاتف عن 7 أرقام',
  ];
  MobileMaxLength = [
    'Phone number cannot be more than 15 digits',
    'لا يمكن أن يكون رقم الهاتف أكثر من 15 رقمًا',
  ];
  validMobile = [
    'Please enter valid Phone number ',
    'الرجاء إدخال رقم هاتف صحيح',
  ];
  //boat add=============
  //boat name=====
  //about==========
  emptyabout = ['Please enter text', 'الرجاء إدخال النص'];
  maxlenabout = [
    'About cannot be more than 250 characters.',
    ' لا يمكن أن يكون النص أكثر من 250 حرفًا.',
  ];
  minlenabout = [
    'About must be of minimum 3 characters.',
    'يجب ألا يقل النص عن 3 أحرف.',
  ];
  //address==========
  emptyaddress = ['Please enter address text', 'الرجاء إدخال نص العنوان'];
  maxlenaddress = [
    'Address cannot be more than 250 characters.',
    'لا يمكن أن يكون العنوان أكثر من 250 حرفًا.',
  ];
  minlenaddress = [
    'Title must be at least 3 characters long.',
    'يجب ألا يقل العنوان عن 3 أحرف.',
  ];
  // For old Password
  emptyoldPassword = [
    'Please enter old password',
    'الرجاء إدخال كلمة المرور القديمة',
    'Please enter new password',
  ];
  PasswordoldMinLength = [
    'Old password must be of minimum 6 characters',
    'يجب ألا تقل كلمة المرور القديمة عن 6 أحرف',
  ];
  PasswordoldMaxLength = [
    'Old password cannot be more than 16 characters',
    'لا يمكن أن تكون كلمة المرور القديمة أكثر من 16 حرفًا',
  ];
  // For New Password
  emptyNewPassword = [
    'Please enter new password',
    'الرجاء إدخال كلمة المرور الجديدة',
  ];
  PasswordNewMinLength = [
    'New password must be of minimum 6 characters',
    'يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف',
  ];
  PasswordNewMaxLength = [
    'New password cannot be more than 16 characters',
    'لا يمكن أن تكون كلمة المرور الجديدة أكثر من 16 حرفًا',
  ];
  //Message====
  emptyMessage = ['Please enter message text', 'الرجاء إدخال نص الرسالة'];
  maxlenMessage = [
    'Message cannot be more than 250 characters.',
    'لا يمكن أن تكون الرسالة أكثر من 250 حرفًا.',
  ];
  minlenMessage = [
    'The message must be at least 3 characters.',
    'يجب ألا تقل الرسالة عن 3 أحرف.',
  ];

  emptySelectImage = [
    'Please add at least one image',
    'الرجاء إضافة صورة واحدة على الأقل',
  ];

  //===========================signup========================
  validataionnewpass = [
    'Please enter  password',
    'الرجاء إدخال كلمة المرور',
    'Por favor insira uma nova senha',
  ];
  validataionnewpasslength = [
    'password length should be minimum 6 character',
    'يجب ألا يقل طول كلمة المرور عن 6 أحرف',
    'O comprimento da senha deve ter no mínimo 6 caracteres',
  ];
  validataionconfirmpass = [
    'Please confirm password',
    'الرجاء تأكيد كلمة المرور',
    'Por favor digite a senha de confirmação',
  ];
  validationnotmatchpass = [
    'Password does not match',
    'كلمة السر غير متطابقة',
    'sua senha não é igual',
  ];
  //==========================Confirmation Messages=============================
  information = ['Information Message', 'رسالة إعلامية'];
  msgTitleServerNotRespond = ['Connection Error', 'خطأ في الإتصال'];
  msgTitleNoNetwork = ['Connection Error', 'خطأ في الإتصال'];
  cancel = ['Cancel', 'إلغاء'];
  Yes = ['Yes', 'نعم'];
  No = ['No', 'لا'];
  ok = ['Ok', 'موافق'];
  or = ['Or', 'أو'];
  save = ['Save', 'حفظ'];
  Done = ['Done', 'تم'];
  Confirm = ['Confirm', 'تأكيد'];
  Save = ['Save', 'حفظ'];
  Skip = ['Skip', 'تخطي'];
  Clear = ['Clear', 'واضح'];
  titleexitapp = ['Exip App', ' إغلاق التطبيق'];
  exitappmessage = [
    'Do you want to exit app',
    'هل تريد الخروج من التطبيق',
    'Você quer sair do aplicativo',
  ];
  msgConfirmTextLogoutMsg = [
    'Are you sure you want to Logout?',
    'هل تريد تسجيل الخروج؟',
  ];
  msgLoginError = ['Please login first?', 'الرجاء تسجيل الدخول أولا؟'];
  //===========static text change
  password_placeholder = ['Password', 'كلمة المرور'];
  email_placeholder = ['Email', 'البريد الإلكتروني'];
  Home = ['Home', 'الرئيسية'];
  Message = ["You don't have account?", 'ليس لديك حساب؟'];
  Signup = ['Signup', 'اشترك'];
  Forgot_password = ['Forgot Password?', 'هل نسيت كلمة السر؟'];
  Login_guest = ['Login as a guest', 'تسجيل الدخول كضيف'];
  New_password_placeholder = ['New Password', 'كلمة مرور جديدة'];
  confirm_password_placeholder = [
    'Confirm New Password',
    'تأكيد كلمة المرور الجديدة',
  ];
  name_placeholder = ['Enter the Name', 'أدخل الاسم'];
  Message_signup_page = ['Already have an account ?', 'هل لديك حساب بالفعل ؟'];
  clicking_signup_btn = ['I accept all', 'أنا أقبل كل شيء'];
  tearmsetting = ['Terms & Conditions', 'الشروط والأحكام'];
  and = ['and', 'و'];
  privacy = ['Privacy Policy', 'سياسة الخصوصية'];
  Submit = ['Submit', 'إشترك'];
  Setting = ['Settings', 'إعدادات'];
  aboutmeedit = ['About Us', 'معلومات عنا'];
  titleTermscondition = ['Terms & Conditions', 'الشروط والاحكام'];
  CandidateDetails = ['Candidate Details', 'تفاصيل المرشح'];
  email = ['Email', 'البريد الإلكتروني'];
  password = ['Password', 'كلمة المرور'];
  confirmpassword = ['Confirm Password', 'تأكيد كلمة المرور'];
  remember = ['Remember me', 'تذكرنى'];
  forgot = ['Forgot Password?', 'هل نسيت كلمة المرور؟'];
  firstname = ['First Name', 'الاسم الاول'];
  lasttname = ['Last Name', 'الكنية'];
  mobile_placeholder = ['Email', 'البريد الإلكتروني'];
  categories = ['Categories', 'الفئات'];
  view = ['View All', 'مشاهدة الكل'];
  English = ['English', 'إنجليزي'];
  Arabic = ['Arabic', 'عربي'];
  daily = ['Daily', 'اليومي'];
  week = ['Weekly', 'أسبوعي'];
  month = ['Monthly', 'شهريا'];
  login = ['LOGIN', 'تسجيل الدخول'];
  login1 = ['Login', 'تسجيل الدخول'];
  signup = ['SIGNUP', 'اشتراك'];
  mobile = ['Mobile', 'التليفون المحمول'];
  twenty = ['+20', '+20'];
  show = ['Show', 'عرض'];
  Hide = ['Hide', 'اخفاء'];
  facebook = ['Facebook', 'فيسبوك'];
  google = ['Google', 'جوجل'];
  appliances = ['Select Appliances', 'اختر الأجهزة'];
  appliances1 = ['Appliances', 'الأجهزة'];
  description = ['Description', 'وصف'];
  category = ['Category', 'الفئة'];
  add = ['Add Video / Image', 'أضف فيديو / صورة'];
  name = ['Name', 'اسم'];
  continue = ['Continue', 'استمر'];
  previous = ['Previous', 'السابق'];
  gallary = ['Gallary', 'معرض'];
  gallary1 = ['Image From Gallery', 'صورة من المعرض'];
  camera = ['Camera', 'آلة تصوير'];
  camera1 = ['Image From Camera', 'صورة باستخدام الكاميرا '];
  video1 = ['Video From Camera', 'فيديو من الكاميرا'];
  video2 = ['Video From Gallary', 'فيديو من معرض الصور'];
  cancel = ['Cancel', 'الغاء'];
  Select_Option = ['Select Option', 'حدد خيار'];
  update = ['Save & Update', 'حفظ وتحديث'];
  block = ['Block', 'إخفاء'];
  report = ['Cancel Order', 'الغاء الطلب'];
  send = ['Send', 'إرسال'];
  doyou = ['Do not have an account?', 'لا تملك حساب؟'];
  already = ['Already have an accound?', 'هل لديك حساب بالفعل؟'];

  // ---------------Atul Texts--------------
  //===========14-03-2022------------
  myvehicles_txt = ['My Vehicles', 'مركباتي'];
  hyundai_txt = ['Hyundai Tucson', 'هيونداي توكسون'];
  microcar_txt = ['Micro Car', 'مايكرو كار'];
  platenumber_txt = ['Plate Number', 'رقم اللوحة'];
  btn_txt = ['375 BTN', '375 BTN'];
  make_txt = ['Make', 'يجعلون'];
  color1_txt = ['Color', 'اللون'];
  suv_txt = ['Suv Car', 'سيارات الدفع الرباعي'];
  addvechicle_txt = ['Add vehicle', 'أضف مركبة'];
  giulia_txt = ['Giulia', 'جوليا'];
  editvechile_txt = ['Edit My Vehicle', 'تعديل سيارتي'];
  selectcategory_txt = ['Select category', 'اختر الفئة'];
  selectmake_txt = ['Select Make', 'حدد الصنع'];
  hyundai2_txt = ['Hyundai', 'هيونداي'];
  selectmodel_txt = ['Select Model', 'حدد الطراز'];
  selectcolor_txt = ['Select Color', 'إختر اللون'];
  enterplatenumber_txt = ['Enter Plate Number', 'أدخل رقم اللوحة'];
  update_txt = ['Update', 'تحديث'];
  red_txt = ['Red', 'أحمر'];
  profile_txt = ['Profile', 'الملف الشخصي'];
  asimsheikh_txt = ['Asim Sheikh', 'عاصم شيخ'];
  asimsheikh1_txt = ['+20 0837920271', '+20 0837920271'];
  asimsheikh2_txt = ['Asimsheikh@gmail.com', 'Asimsheikh@gmail.com'];
  editprofile_txt = ['Edit Profile', 'تعديل الملف الشخصي'];
  savedlocation_txt = ['Saved Location', 'الموقع المحفوظ'];
  mywallet_txt = ['My Wallet', 'محفظتى'];
  language_txt = ['Language', 'لغة'];
  setting_txt = ['Settings', 'إعدادات'];
  fullname_txt = ['Full Name', 'الاسم الكامل'];
  mobile_txt = ['Mobile', 'التليفون المحمول'];
  twenty_txt = ['+20', '+20'];
  email_txt = ['Email', 'البريد الإلكتروني'];
  savedlocation = ['Saved Location', '"الموقع المحفوظ'];
  office_txt = ['Office', 'مكتب'];
  sar_txt = ['EGP', 'جنيه مصري'];
  sar1_txt = ['28', '28'];
  totalamount_txt = ['(Total Amount)', '(المبلغ الإجمالي)'];
  language_txt = ['Language', 'لغة'];
  english_txt = ['English', 'إنجليزي'];
  arabic_txt = ['Arabic', 'عربي'];
  settings1_txt = ['Settings', 'إعدادات'];
  notification_txt = ['Notifications', 'إشعارات'];
  password1_txt = ['Change Password ', 'غير كلمة السر'];
  contactus_txt = ['Contact Us', 'اتصل بنا'];
  faqs_txt = ["FAQ's", 'التعليمات'];
  term2_txt = ['Term & Condition', 'الشروط و الأحكام'];
  privacy_txt = ['Privacy Policy', 'سياسة الخصوصية'];
  about_txt = ['About US', 'معلومات عنا'];
  logout_txt = ['Logout', 'تسجيل خروج'];
  rate_txt = ['Rate App', 'قيم التطبيق'];
  share_txt = ['Share App', 'شارك التطبيق'];
  deleteaccount_txt = ['Delete Account', 'حذف الحساب'];
  logout1_txt = ['Logout', 'تسجيل خروج'];
  changepassword_txt = ['Change Password', 'غير كلمة السر'];
  oldPassword_txt = ['Old Password', 'كلمة المرور القديمة'];
  show_txt = ['Show', 'عرض'];
  newpassword_txt = ['New Password', 'كلمة مرور جديدة'];
  conformpassword_txt = ['Confirm New Password', 'تأكيد كلمة المرور الجديدة'];
  resetpassword_txt = ['Reset Password', 'إعادة تعيين كلمة مرور'];
  ontheway_txt = ['On the way', 'في الطريق'];
  contact_txt = ['Contact Us', 'اتصل بنا'];
  message_txt = ['Message', 'رسالة'];
  howoften_txt = [
    'Where I saw client bookings in app?',
    'أين رأيت حجوزات العملاء في التطبيق؟',
  ];
  whydid_txt = ['How I do cancel my job', 'كيف ألغي وظيفتي'];
  isthiswash_txt = [
    'Is the wash safe for alloy wheels?',
    'هل الغسيل آمن للعجلات المعدنية؟',
  ];
  termcondition_txt = ['Term & Condition', 'الشروط و الأحكام'];
  privacypolicy_txt = ['Privacy Policy', 'سياسة الخصوصية'];
  terms_txt = ['Term & Condition', 'الشروط و الأحكام'];
  mybookings_txt = ['My Bookings', 'حجوزاتي'];
  bookingid_txt = ['Booking ID: #7899302010', 'رقم الحجز: # 7899302010'];
  time_txt = ['15/Feb/22, 10:00AM', '15 / فبراير / 22 ، 10:00 صباحًا'];
  service_txt = ['Service', 'خدمة'];
  dry_txt = ['Dry Wash', 'غسيل جاف'];
  time1_txt = ['Time Slot', 'فسحة زمنية'];
  time2_txt = ['02:00AM', '02:00 صباحا'];
  date_txt = ['Date', 'تاريخ'];
  today_txt = ['Today', 'اليوم'];
  tomorrow_txt = ['Tomorrow', 'الغد'];
  number1_txt = ['395', 'ثلاثة مائة وخمسة وتسعون'];
  btn1_txt = ['BTN', 'BTN'];
  payment_txt = ['Payment By:', 'الدفع بواسطة'];
  payment_txt1 = ['Payment By', 'الدفع بواسطة'];
  cash_txt = ['Cash', 'نقدي'];
  pending_txt = ['Pending', 'قيد الانتظار'];
  inprogress_txt = ['Inprogress', 'في تَقَدم'];
  completed_txt = ['Completed', 'مكتمل'];
  cancel_txt = ['Cancelled', 'ألغيت'];
  detailscode_txt = ['#765456789', '# 765456789'];
  adress_txt = ['Address', 'عنوان'];
  home1_txt = ['Home', 'الرئيسية'];
  //==========================25/03/2022,atul texts
  navigatelocation_txt = ['Navigate Location', 'انتقل الموقع'];
  today1_txt = ['Today,02:15PM', 'اليوم 02: 15 مساءً'];
  cardetails_txt = ['Your Car Details', 'تفاصيل سيارتك'];
  custcardetails_txt = ['Customer Car Details', 'تفاصيل سيارة العميل'];
  btn2_txt = ['395 BTN', '395 BTN'];
  fourtysix_txt = ['46 EGP', '46 ج'];
  extraservice_txt = ['Extra Services', 'خدمات إضافية'];
  windshield_txt = [
    'Windshield chip and crack repair',
    'رقاقة الزجاج الأمامي وإصلاح الكراك',
  ];
  //==========================26/03/2022,atul texts
  fifteen_txt = ['15 EGP', '15 ج'];
  subtotal_txt = ['Sub Total', 'المجموع الفرعي'];
  seven_txt = ['7 EGP', '7 ج'];
  vat_txt = ['VAT', 'ضريبة القيمة المضافة'];
  varid_txt = ['VAT ID #7498302910', 'رقم ضريبة القيمة المضافة # 7498302910'];
  totalservicecharges_txt = ['Total Service Charge', 'إجمالي رسوم الخدمة'];
  sixtyeight_txt = ['68 EGP', '68 ج'];
  coupon_txt = ['Coupon Applied', 'تم تطبيق الكوبون'];
  twelve_txt = ['-12 EGP', '12 ج'];
  wallet_txt = ['Wallet Applied', 'تطبيق المحفظة'];
  twentyeight_txt = ['28 EGP', '28 ج'];
  grand_txt = ['total amount', 'المبلغ الإجمالي'];
  cancel1_txt = ['Cancel', 'إلغاء'];
  reschedule_txt = ['Reschedule', 'إعادة الجدولة'];
  //==========================28/03/2022,atul texts
  goback_txt = ['yes', 'نعم'];
  Doyouwanttoexitapp_txt = [
    'Do you want to exit app',
    'هل تريد الخروج من التطبيق',
  ];
  serviceboy_txt = ['Service Boy', 'خادم الخدمة'];
  user_details_txt = ['User Details', 'بيانات المستخدم'];
  user_review = ['User Review', 'مراجعة المستخدم'];
  five_txt = ['(5.0)', '(5.0)'];
  trackyourbooking_txt = ['Track Your Booking', 'تتبع الحجز الخاص بك'];
  startwashing_txt = ['Start Washing', 'ابدأ الغسيل'];
  cancelservice_txt = ['Cancel Service', 'إلغاء الخدمة'];
  submit1_txt = ['Submit', 'اشترك'];
  selectdate_txt = ['Select Date', 'حدد تاريخ'];
  Selectdatetime_txt = ['Select Date & Time', 'حدد التاريخ والوقت'];
  continue_txt = ['Continue', 'استمر'];
  sucess1_txt = ['Success', 'النجاح'];
  youhavesuceessfully_txt = [
    'You have successfully Rescheduled',
    'لقد نجحت في إعادة الجدولة',
  ];
  yourbooking_txt = ['Your booking', 'حجزك'];
  bookingid1_txt = ['Booking ID', 'رقم الحجز'];
  done_txt = ['Done', 'تم'];
  selecttime1_txt = ['Select Time', 'حدد الوقت'];
  //==========================31/03/2022,atul texts
  photosworking_txt = ['upload work photos', 'تحميل صور للعمل'];
  uploadphotosworking_txt = ['Upload work photos', 'تحميل صور العمل'];
  maxuploadphotos_txt = [
    '(Maximum 8 photos uploaded)',
    '(تم تحميل 8 صور كحد أقصى)',
  ];
  ratenow_txt = ['Rate Now', 'قيم الآن'];
  arsalansheikh1_txt = ['Arsalan Sheikh', 'شيخ أرسلان'];

  //==========================1/03/2022,atul texts
  one_txt = ['1', 'واحد'];
  two_txt = ['2', 'إثنان'];

  howoften_txt_open = [
    'You will see a upcoming bookings in home and also in a booking section',
    'ستجد الحجوزات القادمة في الصفحة الرئيسية وأيضًا في قسم الحجز',
  ];
  //==========================2/03/2022,atul texts
  your_review_txt = ['Your Review', 'مراجعتك'];
  total_txt = ['Total Car', 'إجمالي السيارات'];
  total_txt7 = ['7', 'سبعة'];
  commision_txt = ['Commission', 'العمولة'];
  ServicesBonus_txt = ['Extra Services Bonus', 'عمولة الخدمات الإضافية'];
  Eservice_txt = ['Extra Services', 'خدمات إضافية'];
  sar30_txt = ['30 EGP', '30 ج'];
  sar15_txt = ['15 EGP', '15 ج'];
  total_txt7 = ['7', 'سبعة'];

  //============================================
  delete_acc_title = ['Delete Account?', 'حذف الحساب؟'];
  delete_acc_msg = [
    'Are You Sure, You Want to Delete Account',
    'هل أنت متأكد أنك تريد حذف الحساب',
  ];
  delete_success_txt = [
    'Account deleted successfully',
    'لقد نجحت في حذف الحساب',
  ];
  about_us = ['About Us', 'معلومات عنا'];
  reviews_txt = ['My Reviews', 'تعليقاتي'];
  documents_txt = ['My Documents', 'مستنداتي'];

  //==========================Delete Acc
  no_txt = ['No', 'لا'];
  yes_txt = ['Yes', 'نعم'];
  //==========================5/03/2022,atul texts
  forget_password_txt = ['Forgot Password', 'هل نسيت كلمة السر'];
  today_Service_txt = ["Today's Services", '"خدمات اليوم'];
  arrive_txt = ['Arrived', 'وصل'];
  startWashind_txt = ['Start Washing', 'ابدأ الغسل'];
  washIncomplete_txt = ['Completed', 'مكتمل'];
  collect_txt = ['Collect Amount', 'اجمع المبلغ'];

  //=============notification

  review_txt = ['My Reviews', 'تعليقاتي'];
  clearAll = ['Clear All', 'امسح الكل'];
  //==========================5/03/2022,atul texts
  my_earning_txt = ['My Earning', 'أرباحي'];
  twelve1_txt = ['1,230', '1،230'];
  total_earning_txt = ['(Total Earning)', ' (مجموع الأرباح)'];
  march_Txt = ['March', 'مارس'];
  services = ['Services', 'خدمات'];
  arsalanQ1_sheikh = [
    'Are you satisfied with SHINEFY Experience?',
    'هل أنت راض عن الخدمة؟',
  ];
  arsalanQ2_sheikh = ['Is the work of', 'هل عمل'];
  arsalanQ2_2_sheikh = ['meet your expectations?', 'يلبي توقعاتك؟'];
  arsalanQ3_sheikh = ['Does', 'هل'];
  arsalanQ3_2_sheikh = ['asked for accepted tips?', ' طلب إكرامية أو قبلها؟'];
  istxt = ['Is', 'هو'];
  arsalan_sheikh = ['Arsalan sheikh', 'شيخ أرسلان'];
  //====================================
  booking = ['Booking', 'الحجز'];
  bookings = ['Bookings', 'الحجوزات'];
  cal_txt = ['Calender', 'التقويم'];
  home_txt = ['Home', 'الرئيسية'];
  myearnimg_txt = ['My Earning', 'أرباحي'];
  Profile_txt = ['Profile', 'الملف الشخصي'];
  //==========================hariom

  otp_verification = ['OTP Verification', 'التحقق من OTP'];
  otp_verification_msg = [
    'Please enter the verification code',
    'الرجاء كتابة رمز التحقق المرسل ',
  ];
  login_sucess = ['Login sucessfully', 'تم تسجيل الدخول بنجاح'];
  emptyConfirmNewPWD = [
    'Please enter the new password',
    'الرجاء إدخال  كلمة المرور الجديدة',
  ];
  time_slot = ['Time Slot', 'فسحة زمنية'];
  language_change = ['language Change', 'تغير اللغة'];
  Lang_change_msg = [
    'To change language you need to restart the app',
    'لتغيير اللغة تحتاج إلى إعادة تشغيل التطبيق؟  ',
  ];
  show = ['Show', 'عرض'];
  Hide = ['Hide', 'اخفاء'];
  titleexitapp = ['Exip App', 'إغلاق التطبيق '];
  exitappmessage = [
    'Do you want to exit app ? ',
    'هل تريد الخروج من التطبيق؟',
    'Você quer sair do aplicativo',
  ];
  app_name = ['ShinefyDriver', 'سائق شينفي'];
  clear_notification_detail = [
    'Do you want to clear your notifications ?',
    'هل تريد مسح إشعاراتك؟',
  ];
  delete = ['Delete', 'حذف'];
  delete_noti_detail = [
    'Do you want to delete this notification ?',
    'هل تريد حذف هذا الإخطار؟',
  ];
  diffrentPassword = [
    'The current password and password must be different',
    'يجب أن تكون كلمة المرور وكلمة المرور الحالية مختلفتين',
  ];
  notes = ['Notes', 'الملاحظات'];
  noNotes = ['No Notes Found', 'لا يوجد ملاحظات'];
}
export const Lang_chg = new Language_provider();
