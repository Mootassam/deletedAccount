const tr = {
  app: {
    title: 'Nowspeed',
  },

  validation: {
    withdrawalMethodRequired: "Talebinizi göndermeden önce bir çekim yöntemi (Banka veya Kripto) seçiniz",

    withdrawNotAllowed: "Hesabınız için para çekme işlemleri şu anda devre dışı bırakılmıştır. Lütfen müşteri hizmetleri ile iletişime geçin",

    minimumBalanceRequired: "Çekim işleminden sonra gerekli minimum bakiyeyi korumanız gerekir",

    missingWalletDetails: "Kripto çekim talebi göndermeden önce cüzdan bilgilerinizi tamamlayınız",

    missingERC20Address: "Çekim talebi göndermeden önce ERC20 cüzdan adresinizi bağlayınız",

    missingTRC20Address: "Çekim talebi göndermeden önce TRC20 cüzdan adresinizi bağlayınız"
    ,
    inValidWithdrawPassword: 'Çekim şifreniz doğru değil, lütfen tekrar kontrol edin',
    missingBankDetails: 'Lütfen çekim yapmadan önce banka bilgilerinizi ekleyin',
    missingWithdrawalMethod: 'Lütfen çekim yapmadan önce bir kripto cüzdan veya banka bilgisi ekleyin',
    exceedsBalance: 'Görünüşe göre çekim miktarınız bakiyenizi aşıyor',
    missingWalletAddress: 'Lütfen çekim talebi göndermeden önce "Cüzdan" bölümüne giderek USDT (TRC20) veya ERC20 adresinizi bağlayın.',
    requiredAmount: 'Lütfen miktarı yazın',
    notFoundTransaction: 'İşlem bulunamadı',
    permissoin: "Lütfen yardım için müşteri hizmetleriyle iletişime geçmeyi deneyin",
    duplicateSubsctription: 'Bu plana zaten abonesiniz',
    InsufficientBalance: 'Yetersiz bakiye',
    requiredSubscription: 'Lütfen bir abonelik planı seçin',
    moretasks: 'Bu sizin limitiniz. Daha fazla görev için lütfen müşteri hizmetleriyle iletişime geçin',
    deposit: "Yetersiz bakiye, lütfen yükseltin.",
    insufficientBalanceMin: "Devam etmek için bakiyeniz en az €{0} olmalıdır.",
    submitPendingProducts: "Lütfen bekleyen ürünleri gönderin",
    noProductsAvailable: "Uygun ürün yok",
    oldPasswordRequired: "Eski şifre gerekli",
    newPasswordRequired: "Yeni şifre gerekli",
    newPasswordTooShort: "Yeni şifre en az 4 karakter olmalıdır",
    newPasswordTooLong: "Yeni şifre 50 karakteri aşmamalıdır",
    newPasswordDifferentFromOld: "Yeni şifre eski şifreden farklı olmalıdır",
    userNotFound: "Kullanıcı bulunamadı",
    invalidOldWithdrawalPassword: "Eski çekim şifresi yanlış",
    updatePasswordFailed: "Şifre güncellemesi başarısız. Lütfen tekrar deneyin.",
    productNotFound: "Ürün bulunamadı",
    invalidPriceOrCommission: "Geçersiz fiyat veya komisyon değerleri",
    invalidPriceRange: "Fiyat oluşturma için geçersiz min veya max değerleri",
    cleanDatabaseOnlyForTest: "Veritabanı temizleme yalnızca test modunda izinlidir",
    stripeLineItemPriceIdNull: "Stripe line_items.data[0].price.id eksik",
    noRecordsToComplete: "Tamamlanacak kayıt bulunamadı",
    noPendingRecord: "Bekleyen kayıt bulunamadı"
  },

  auth: {
    userNotFound: `Üzgünüz, kimlik bilgilerinizi tanımıyoruz`,
    wrongPassword: `Üzgünüz, kimlik bilgilerinizi tanımıyoruz`,
    weakPassword: 'Bu şifre çok zayıf',
    emailAlreadyInUse: 'Kullanıcı adı zaten kullanılıyor',
    invitationCode: 'lütfen doğru bir davet kodu yazın',
    invalidEmail: 'Lütfen geçerli bir email adresi sağlayın',
    passwordReset: {
      invalidToken: 'Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş',
      error: `Email tanınmadı`,
    },
    emailAddressVerificationEmail: {
      invalidToken: 'Email doğrulama bağlantısı geçersiz veya süresi dolmuş.',
      error: `Email tanınmadı.`,
      signedInAsWrongUser: `Bu email onayı {0} adresine gönderildi ancak siz {1} olarak giriş yaptınız.`,
    },
    passwordChange: {
      invalidPassword: 'Eski şifre geçersiz',
    },
  },

  user: {
    errors: {
      userAlreadyExists: 'Bu email ile bir kullanıcı zaten var.',
      userNotFound: 'Kullanıcı bulunamadı.',
      destroyingHimself: `Kendinizi silemezsiniz.`,
      revokingOwnPermission: `Kendi yönetici izinlerinizi iptal edemezsiniz.`,
      revokingPlanUser: `Plan yöneticisinin yönetici izinlerini iptal edemezsiniz.`,
      destroyingPlanUser: `Plan yöneticisini silemezsiniz.`,
    },
  },

  tenant: {
    exists: 'Bu uygulamada zaten bir çalışma alanı var.',
    url: {
      exists: 'Bu çalışma alanı URL\'si zaten kullanılıyor.',
    },
    invitation: {
      notSameEmail: `Bu davet {0} adresine gönderildi ancak siz {1} olarak giriş yaptınız.`,
    },
    planActive: `Bu çalışma alanı için aktif bir plan var. Lütfen önce planı iptal edin.`,
    stripeNotConfigured: 'Stripe yapılandırılmamış.',
  },

  importer: {
    errors: {
      invalidFileEmpty: 'Dosya boş',
      invalidFileExcel: 'Sadece Excel (.xlsx) dosyalarına izin verilir',
      invalidFileUpload: 'Geçersiz dosya. Şablonun en son sürümünü kullandığınızdan emin olun.',
      importHashRequired: 'İçe aktarma hash\'i gerekli',
      importHashExistent: 'Veriler zaten içe aktarılmış',
    },
  },

  errors: {
    notFound: {
      message: 'Bulunamadı',
    },
    forbidden: {
      message: 'Yasaklı',
    },
    validation: {
      message: 'Bir hata oluştu',
    },
  },

  email: {
    error: `Email sağlayıcı yapılandırılmamış.`,
  },

  preview: {
    error: 'Üzgünüz, bu işlem önizleme modunda izin verilmiyor.',
  },
};

export default tr;
