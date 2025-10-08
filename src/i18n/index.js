import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    appName: 'CoNotes',
    tagline: 'Your personal Real-time Note',
    nav: {
      home: 'Home',
      notes: 'Notes',
      about: 'About',
      dashboard: 'Dashboard',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      language: 'Language',
      english: 'English',
      arabic: 'Arabic'
    },
    common: {
      loading: 'Loading...',
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save',
      saving: 'Saving...',
      backToNotes: 'Back to Notes',
      viewOnly: 'View only',
      unknown: 'Unknown',
      visitWebsite: 'Visit Website',
      lastUpdatedAt: 'Last updated: {date}'
    },
    footer: {
      pages: 'Pages',
      contact: 'Contact',
      followUs: 'Follow us:',
      rightsReserved: '© {year} {app}. All rights reserved.'
    },
    sidebar: {
      home: 'Home',
      users: 'Users',
      notes: 'Notes'
    },
    home: {
      heroTitle: 'Collaborative notes for teams and individuals',
      heroSubtitle: 'Create, edit and collaborate in real-time. Share notes with teammates, track updates, and keep everything in sync across devices.',
      getStarted: 'Get started',
      features: {
        syncTitle: 'Real-time sync',
        syncDesc: 'Everyone sees edits instantly.',
        shareTitle: 'Shareable Notes',
        shareDesc: 'Invite teammates in seconds.',
        privateTitle: 'Private by default',
        privateDesc: 'Secure storage and auth.',
        accessTitle: 'Access controls',
        accessDesc: 'Manage permissions easily.'
      },
      howItWorksTitle: 'How it works',
      howItWorksSubtitle: 'Three simple steps to get your team collaborating quickly. Each step includes an interactive preview so you know what to expect.',
      step1: { badge: 'Step 1', title: 'Create a note', desc: 'Open the editor and start writing — markdown support, attachments, and rich formatting included.' },
      step2: { badge: 'Step 2', title: 'Invite collaborators', desc: 'Share a link or invite teammates by email. Manage permissions per-note so everyone has the right access.' },
      step3: { badge: 'Step 3', title: 'Stay in sync', desc: 'Edits are propagated in real-time so collaborators always see the latest version without conflicts.' },
      testimonialsTitle: 'What customers say',
      ctaTitle: 'Ready to collaborate?',
      ctaSubtitle: 'Get started for free — no credit card required.'
    },
    about: {
      title: 'About CoNote',
      intro: 'CoNote is a collaborative notes app for teams and individuals. Create, edit, and collaborate in real-time with secure access controls and a modern, fast UI.',
      keyFeatures: 'Key features',
      keyFeaturesSubtitle: 'A modern toolkit for collaborative note-taking.',
      features: {
        fastEditorTitle: 'Fast editor',
        fastEditorDesc: 'Rich text and markdown-friendly note editing with instant feedback.',
        collaborationTitle: 'Collaboration',
        collaborationDesc: 'Share notes, co-edit seamlessly, and keep everyone in sync.',
        privacyTitle: 'Privacy & roles',
        privacyDesc: 'Authentication, role-based access, and secure storage.'
      },
      whyTitle: 'Why CoNotes?',
      why1: 'Reduce friction in capturing, organizing, and sharing knowledge.',
      why2: 'Built with performance and simplicity in mind.',
      why3: 'Designed for teams, friendly for individuals.',
      ctaTryTitle: 'Ready to try CoNotes?',
      ctaSubtitle: 'Get started for free — no credit card required.'
    },
    notes: {
      heroListTitle: 'Your Notes',
      heroListSubtitle: 'Create, edit and collaborate',
      createNew: 'Create New Note',
      searchPlaceholder: 'Search notes (title and content)',
      loadingList: 'Loading notes...',
      emptyList: 'No notes yet. Create your first one above!',
      deleteTitle: 'Delete note',
      deleteMessage: 'Are you sure you want to permanently delete this note? This action cannot be undone.',
      ownerUnknownFallback: 'Unknown',
      listLastUpdated: 'Last updated: {date}',
      createHeroTitle: 'Create New Note',
      createHeroSubtitle: 'Start a new idea and collaborate later',
      titlePlaceholder: 'Note Title',
      titleRequired: 'Title is required',
      titleMax: 'Title must be 200 characters or less',
      save: 'Save',
      saving: 'Saving…',
      backToNotes: 'Back to Notes',
      toastCreated: 'Note created successfully!',
      toastSaveFailed: 'Failed to save note.',
      toastFetchFailed: 'Failed to fetch notes.',
      showHeroTitle: 'Edit Note',
      showHeroSubtitle: 'Manage content and collaborators',
      viewOnly: 'View only',
      loadingNote: 'Loading note...',
      errorFetchNote: 'Failed to fetch note.',
      inputTitlePlaceholder: 'Note Title',
      presenceOnline: '{count} online',
      collaborators: 'Collaborators',
      loading: 'Loading...',
      inviteByEmail: 'Invite by email',
      permissionView: 'View',
      permissionEdit: 'Edit',
      inviteUpdate: 'Invite / Update',
      noCollaborators: 'No collaborators yet.',
      remove: 'Remove',
      toastSaved: 'Note saved successfully!',
      toastCollaboratorUpdated: 'Collaborator updated',
      toastInviteFailed: 'Failed to invite/update',
      toastPermissionUpdated: 'Permission updated',
      toastPermissionFailed: 'Failed to update permission',
      toastCollabRemoved: 'Collaborator removed',
      toastRemoveFailed: 'Failed to remove',
      export: { md: 'Export Markdown', html: 'Export HTML', pdf: 'Export PDF' },
      failedExport: 'Failed to export',
      toastDeleted: 'Note deleted successfully!',
      toastDeleteFailed: 'Failed to delete note.'
    },
    auth: {
      loginBannerTitle: 'Welcome back',
      loginBannerSubtitle: 'Sign in to access your notes and collaborate.',
      signIn: 'Sign in',
      useCredentials: 'Use your credentials below',
      email: 'Email',
      emailPlaceholder: 'your email',
      password: 'Password',
      passwordPlaceholder: 'Your password',
      signingIn: 'Signing in...',
      continueWithGoogle: 'Continue with Google',
      noAccount: "Don't have an account?",
      createOne: 'Create one',
      loginSuccess: 'Logged in successfully',
      loginFailed: 'Login failed',
      redirectGoogle: 'Redirecting to Google...',
      loggedInWithGoogle: 'Logged in with Google!',
      registerBannerTitle: 'Create account',
      registerBannerSubtitle: 'Join to create, edit, and collaborate on notes.',
      signUp: 'Sign up',
      minuteToSignUp: 'It only takes a minute',
      fullName: 'Full name',
      fullNamePlaceholder: 'Your full name',
      createPasswordPlaceholder: 'Create a password',
      creating: 'Creating...',
      createAccount: 'Create account',
      alreadyHaveAccount: 'Already have an account?',
      signInLink: 'Sign in',
      registeredSuccess: 'Registered successfully'
    },
    dashboard: {
      title: 'Admin Dashboard',
      subtitle: 'Overview and quick actions',
      totalUsers: 'Total Users',
      manageUsers: 'Manage Users',
      totalNotes: 'Total Notes',
      manageNotes: 'Manage Notes',
      activeSessions: 'Active Sessions',
      recentActivity: 'Recent Activity',
      loadingRecent: 'Loading recent activity...',
      noRecent: 'No recent activity yet.',
      untitled: '(untitled)'
    },
    table: {
      headers: {
        avatar: 'Avatar', name: 'Name', email: 'Email', provider: 'Provider', role: 'Role', date: 'Date',
        title: 'Title', owner: 'Owner'
      },
      labels: {
        actions: 'Actions',
        clear: 'Clear',
        noItems: 'No items found',
        prev: 'Previous',
        next: 'Next',
        filterBy: 'Filter by {label}',
        showing: 'Showing {from} to {to} of {total} results'
      },
      tooltips: {
        view: 'View details',
        edit: 'Edit',
        delete: 'Delete'
      }
    },
    confirm: {
      deleteNoteTitle: 'Delete Note',
      deleteUserTitle: 'Delete User',
      deleteConfirmNote: 'Are you sure you want to delete note {title}? This action cannot be undone.',
      deleteConfirmUser: 'Are you sure you want to delete user {name}? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel'
    },
    profile: {
      title: 'Profile',
      subtitle: 'Update your profile',
      avatarLabel: 'Avatar URL',
      avatarHelp: 'Paste a direct image URL. Changes are previewed instantly.',
      uploadFromDevice: 'Upload from device',
      uploading: 'Uploading...',
      nameLabel: 'Name',
      emailLabel: 'Email',
      newPasswordLabel: 'New Password (optional)',
      newPasswordPlaceholder: 'Enter new password (local accounts only)',
      role: 'Role',
      provider: 'Provider',
      saveChanges: 'Save Changes',
      cancel: 'Cancel'
    },
    placeholders: {
      searchNotes: 'Search notes (title and content)'
    },
    validation: {
      emailRequired: 'Email is required',
      emailInvalid: 'Enter a valid email address',
      passwordRequired: 'Password is required',
      passwordMin: 'Password should be at least 6 characters',
      nameRequired: 'Name is required',
      nameMin: 'Name must be at least 3 characters',
      pleaseProvideValid: 'Please provide a valid email and a password with at least 6 characters.',
      pleaseFillAll: 'Please fill all fields with valid values.',
      urlInvalid: 'Enter a valid URL starting with http(s)://',
      fixBeforeSaving: 'Please fix validation errors before saving'
    },
    toast: {
      loggedOut: 'Logged out successfully'
    }
  },
  ar: {
    appName: 'CoNotes',
    tagline: 'ملاحظاتك الفورية الشخصية',
    nav: {
      home: 'الرئيسية',
      notes: 'الملاحظات',
      about: 'حول',
      dashboard: 'لوحة التحكم',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      language: 'اللغة',
      english: 'الإنجليزية',
      arabic: 'العربية'
    },
    common: {
      loading: 'جاري التحميل...',
      cancel: 'إلغاء',
      delete: 'حذف',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      backToNotes: 'العودة إلى الملاحظات',
      viewOnly: 'عرض فقط',
      unknown: 'غير معروف',
      visitWebsite: 'زيارة الموقع',
      lastUpdatedAt: 'آخر تحديث: {date}'
    },
    footer: {
      pages: 'الصفحات',
      contact: 'تواصل',
      followUs: 'تابعنا:',
      rightsReserved: '© {year} {app}. جميع الحقوق محفوظة.'
    },
    sidebar: {
      home: 'الرئيسية',
      users: 'المستخدمون',
      notes: 'الملاحظات'
    },
    home: {
      heroTitle: 'ملاحظات تعاونية للفرق والأفراد',
      heroSubtitle: 'أنشئ وحرر وتعاون في الوقت الفعلي. شارك الملاحظات مع الفريق وتابع التحديثات وابقِ كل شيء متزامنًا عبر الأجهزة.',
      getStarted: 'ابدأ الآن',
      features: {
        syncTitle: 'مزامنة فورية',
        syncDesc: 'يرى الجميع التعديلات فورًا.',
        shareTitle: 'ملاحظات قابلة للمشاركة',
        shareDesc: 'ادعُ زملاءك خلال ثوانٍ.',
        privateTitle: 'خاص افتراضيًا',
        privateDesc: 'تخزين آمن وتوثيق.',
        accessTitle: 'صلاحيات الوصول',
        accessDesc: 'إدارة الصلاحيات بسهولة.'
      },
      howItWorksTitle: 'كيف تعمل',
      howItWorksSubtitle: 'ثلاث خطوات بسيطة لبدء تعاون فريقك بسرعة. كل خطوة تتضمن معاينة تفاعلية.',
      step1: { badge: 'الخطوة 1', title: 'أنشئ ملاحظة', desc: 'افتح المحرر وابدأ بالكتابة — دعم ماركداون ومرفقات وتنسيق غني.' },
      step2: { badge: 'الخطوة 2', title: 'ادعُ المتعاونين', desc: 'شارك رابطًا أو ادعُ عبر البريد الإلكتروني. إدارة الصلاحيات لكل ملاحظة.' },
      step3: { badge: 'الخطوة 3', title: 'ابقَ متزامنًا', desc: 'يتم نشر التعديلات في الوقت الفعلي ليشاهد الجميع آخر نسخة بدون تعارضات.' },
      testimonialsTitle: 'ماذا يقول العملاء',
      ctaTitle: 'جاهز للتعاون؟',
      ctaSubtitle: 'ابدأ مجانًا — لا حاجة لبطاقة ائتمان.'
    },
    about: {
      title: 'حول CoNotes',
      intro: 'CoNotes تطبيق ملاحظات تعاوني للفرق والأفراد. أنشئ وحرر وتعاون في الوقت الفعلي مع تحكم آمن بالوصول وواجهة حديثة وسريعة.',
      keyFeatures: 'الميزات الرئيسية',
      keyFeaturesSubtitle: 'باقة حديثة لتدوين الملاحظات التعاونية.',
      features: {
        fastEditorTitle: 'محرر سريع',
        fastEditorDesc: 'تحرير نص غني ويدعم ماركداون مع استجابة فورية.',
        collaborationTitle: 'تعاون',
        collaborationDesc: 'شارك الملاحظات وتحرير مشترك بسلاسة وتزامن دائم.',
        privacyTitle: 'الخصوصية والأدوار',
        privacyDesc: 'توثيق وصلاحيات وصول وتخزين آمن.'
      },
      whyTitle: 'لماذا CoNotes؟',
      why1: 'تقليل الاحتكاك في التقاط وتنظيم ومشاركة المعرفة.',
      why2: 'مصمم للأداء والبساطة.',
      why3: 'مهيأ للفرق ومناسب للأفراد.',
      ctaTryTitle: 'جاهز لتجربة CoNotes؟',
      ctaSubtitle: 'ابدأ مجانًا — لا حاجة لبطاقة ائتمان.'
    },
    notes: {
      heroListTitle: 'ملاحظاتك',
      heroListSubtitle: 'أنشئ وحرر وتعاون',
      createNew: 'إنشاء ملاحظة جديدة',
      searchPlaceholder: 'ابحث في الملاحظات (العنوان والمحتوى)',
      loadingList: 'جاري تحميل الملاحظات...',
      emptyList: 'لا توجد ملاحظات بعد. أنشئ الأولى بالأعلى!',
      deleteTitle: 'حذف الملاحظة',
      deleteMessage: 'هل أنت متأكد من حذف هذه الملاحظة نهائيًا؟ هذا الإجراء لا يمكن التراجع عنه.',
      ownerUnknownFallback: 'غير معروف',
      listLastUpdated: 'آخر تحديث: {date}',
      createHeroTitle: 'إنشاء ملاحظة جديدة',
      createHeroSubtitle: 'ابدأ فكرة جديدة وتعاون لاحقًا',
      titlePlaceholder: 'عنوان الملاحظة',
      titleRequired: 'العنوان مطلوب',
      titleMax: 'يجب ألا يزيد العنوان عن 200 حرف',
      save: 'حفظ',
      saving: 'جاري الحفظ…',
      backToNotes: 'العودة إلى الملاحظات',
      toastCreated: 'تم إنشاء الملاحظة بنجاح!',
      toastSaveFailed: 'فشل حفظ الملاحظة.',
      toastFetchFailed: 'فشل جلب الملاحظات.',
      showHeroTitle: 'تحرير الملاحظة',
      showHeroSubtitle: 'إدارة المحتوى والمتعاونين',
      viewOnly: 'عرض فقط',
      loadingNote: 'جاري تحميل الملاحظة...',
      errorFetchNote: 'فشل جلب الملاحظة.',
      inputTitlePlaceholder: 'عنوان الملاحظة',
      presenceOnline: '{count} متصل',
      collaborators: 'المتعاونون',
      loading: 'جاري التحميل...',
      inviteByEmail: 'دعوة عبر البريد الإلكتروني',
      permissionView: 'عرض',
      permissionEdit: 'تحرير',
      inviteUpdate: 'دعوة / تحديث',
      noCollaborators: 'لا يوجد متعاونون بعد.',
      remove: 'إزالة',
      toastSaved: 'تم حفظ الملاحظة بنجاح!',
      toastCollaboratorUpdated: 'تم تحديث المتعاون',
      toastInviteFailed: 'فشل الدعوة/التحديث',
      toastPermissionUpdated: 'تم تحديث الصلاحية',
      toastPermissionFailed: 'فشل تحديث الصلاحية',
      toastCollabRemoved: 'تم إزالة المتعاون',
      toastRemoveFailed: 'فشل الإزالة',
      export: { md: 'تصدير ماركداون', html: 'تصدير HTML', pdf: 'تصدير PDF' },
      failedExport: 'فشل التصدير',
      toastDeleted: 'تم حذف الملاحظة بنجاح!',
      toastDeleteFailed: 'فشل حذف الملاحظة.'
    },
    auth: {
      loginBannerTitle: 'مرحبًا بعودتك',
      loginBannerSubtitle: 'سجّل الدخول للوصول إلى ملاحظاتك والتعاون.',
      signIn: 'تسجيل الدخول',
      useCredentials: 'استخدم بياناتك أدناه',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'your email',
      password: 'كلمة المرور',
      passwordPlaceholder: 'كلمة المرور',
      signingIn: 'جاري تسجيل الدخول...',
      continueWithGoogle: 'المتابعة بواسطة Google',
      noAccount: 'لا تملك حسابًا؟',
      createOne: 'أنشئ حسابًا',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      loginFailed: 'فشل تسجيل الدخول',
      redirectGoogle: 'إعادة التوجيه إلى Google...',
      loggedInWithGoogle: 'تم تسجيل الدخول بواسطة Google!',
      registerBannerTitle: 'إنشاء حساب',
      registerBannerSubtitle: 'انضم لإنشاء الملاحظات وتحريرها والتعاون عليها.',
      signUp: 'إنشاء حساب',
      minuteToSignUp: 'لن يستغرق ذلك سوى دقيقة',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'اسمك الكامل',
      createPasswordPlaceholder: 'أنشئ كلمة مرور',
      creating: 'جاري الإنشاء...',
      createAccount: 'إنشاء حساب',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      signInLink: 'تسجيل الدخول',
      registeredSuccess: 'تم التسجيل بنجاح'
    },
    dashboard: {
      title: 'لوحة التحكم',
      subtitle: 'نظرة عامة وإجراءات سريعة',
      totalUsers: 'إجمالي المستخدمين',
      manageUsers: 'إدارة المستخدمين',
      totalNotes: 'إجمالي الملاحظات',
      manageNotes: 'إدارة الملاحظات',
      activeSessions: 'الجلسات النشطة',
      recentActivity: 'النشاط الأخير',
      loadingRecent: 'جاري تحميل النشاط الأخير...',
      noRecent: 'لا يوجد نشاط حديث بعد.',
      untitled: '(بدون عنوان)',
      footerBrand: 'اليونسكو'
    },
    table: {
      headers: {
        avatar: 'الصورة', name: 'الاسم', email: 'البريد الإلكتروني', provider: 'المزوّد', role: 'الدور', date: 'التاريخ',
        title: 'العنوان', owner: 'المالك'
      },
      labels: {
        actions: 'إجراءات',
        clear: 'مسح',
        noItems: 'لا توجد عناصر',
        prev: 'السابق',
        next: 'التالي',
        filterBy: 'تصفية حسب {label}',
        showing: 'عرض {from} إلى {to} من {total} نتيجة'
      },
      tooltips: {
        view: 'عرض التفاصيل',
        edit: 'تحرير',
        delete: 'حذف'
      }
    },
    confirm: {
      deleteNoteTitle: 'حذف الملاحظة',
      deleteUserTitle: 'حذف المستخدم',
      deleteConfirmNote: 'هل أنت متأكد أنك تريد حذف الملاحظة {title}؟ هذا الإجراء لا يمكن التراجع عنه.',
      deleteConfirmUser: 'هل أنت متأكد أنك تريد حذف المستخدم {name}؟ هذا الإجراء لا يمكن التراجع عنه.',
      confirm: 'حذف',
      cancel: 'إلغاء'
    },
    profile: {
      title: 'الملف الشخصي',
      subtitle: 'حدّث بياناتك الشخصية',
      avatarLabel: 'رابط الصورة الشخصية',
      avatarHelp: 'الصق رابط صورة مباشر. يتم عرض التغييرات فورًا.',
      uploadFromDevice: 'رفع من الجهاز',
      uploading: 'جاري الرفع...',
      nameLabel: 'الاسم',
      emailLabel: 'البريد الإلكتروني',
      newPasswordLabel: 'كلمة مرور جديدة (اختياري)',
      newPasswordPlaceholder: 'أدخل كلمة مرور جديدة (للحسابات المحلية فقط)',
      role: 'الدور',
      provider: 'المزوّد',
      saveChanges: 'حفظ التغييرات',
      cancel: 'إلغاء'
    },
    placeholders: {
      searchNotes: 'ابحث في الملاحظات (العنوان والمحتوى)'
    },
    validation: {
      emailRequired: 'البريد الإلكتروني مطلوب',
      emailInvalid: 'أدخل بريدًا إلكترونيًا صالحًا',
      passwordRequired: 'كلمة المرور مطلوبة',
      passwordMin: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      nameRequired: 'الاسم مطلوب',
      nameMin: 'يجب ألا يقل الاسم عن 3 أحرف',
      pleaseProvideValid: 'يرجى إدخال بريد إلكتروني صالح وكلمة مرور لا تقل عن 6 أحرف.',
      pleaseFillAll: 'يرجى ملء جميع الحقول بقيم صحيحة.',
      urlInvalid: 'أدخل رابطًا صحيحًا يبدأ بـ http(s)://',
      fixBeforeSaving: 'يرجى إصلاح أخطاء التحقق قبل الحفظ'
    },
    toast: {
      loggedOut: 'تم تسجيل الخروج بنجاح'
    }
  }
};

const DEFAULT_LOCALE = (typeof localStorage !== 'undefined' && localStorage.getItem('locale')) || 'en';

function applyHtmlLangDir(locale) {
  if (typeof document === 'undefined') return;
  const isRTL = locale === 'ar';
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
}

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages,
});

applyHtmlLangDir(DEFAULT_LOCALE);

export function setLocale(locale) {
  i18n.global.locale.value = locale;
  try { localStorage.setItem('locale', locale); } catch (_) {}
  applyHtmlLangDir(locale);
}

export default i18n;
