const de = {
  app: {
    title: 'Nowspeed',
  },

  validation: {
    withdrawalMethodRequired: "Bitte wählen Sie eine Auszahlungsmethode (Bank oder Krypto), bevor Sie Ihre Anfrage absenden",

    withdrawNotAllowed: "Auszahlungen sind derzeit für Ihr Konto deaktiviert. Bitte kontaktieren Sie den Kundensupport",

    minimumBalanceRequired: "Sie müssen nach der Auszahlung das erforderliche Mindestguthaben beibehalten",

    missingWalletDetails: "Bitte vervollständigen Sie Ihre Wallet-Informationen, bevor Sie eine Krypto-Auszahlungsanfrage senden",

    missingERC20Address: "Bitte hinterlegen Sie Ihre ERC20-Wallet-Adresse, bevor Sie eine Auszahlungsanfrage senden",

    missingTRC20Address: "Bitte hinterlegen Sie Ihre TRC20-Wallet-Adresse, bevor Sie eine Auszahlungsanfrage senden"
    ,
    inValidWithdrawPassword: 'Ihr Auszahlungspasswort ist nicht korrekt, bitte überprüfen Sie es erneut',
    missingBankDetails: 'Bitte fügen Sie vor einer Auszahlung Ihre Bankdaten hinzu',
    missingWithdrawalMethod: 'Bitte fügen Sie entweder eine Krypto-Wallet oder Bankdaten hinzu, bevor Sie eine Auszahlung vornehmen',
    exceedsBalance: 'Es scheint, dass Ihr Auszahlungsbetrag Ihr Guthaben übersteigt',
    missingWalletAddress: 'Bitte gehen Sie zum "Wallet"-Bereich, um Ihre USDT (TRC20) oder ERC20 Adresse zu binden, bevor Sie einen Auszahlungsantrag stellen.',
    requiredAmount: 'Bitte Betrag eingeben',
    notFoundTransaction: 'Transaktion nicht gefunden',
    permissoin: "Bitte versuchen Sie, den Kundenservice für Hilfe zu kontaktieren",
    duplicateSubsctription: 'Sie haben diesen Plan bereits abonniert',
    InsufficientBalance: 'Unzureichendes Guthaben',
    requiredSubscription: 'Bitte wählen Sie einen Abonnementplan aus',
    moretasks: 'Das ist Ihr Limit. Bitte kontaktieren Sie den Kundenservice für weitere Aufgaben',
    deposit: "Unzureichendes Guthaben, bitte upgraden.",
    insufficientBalanceMin: "Ihr Guthaben muss mindestens €{0} betragen, um fortzufahren.",
    submitPendingProducts: "Bitte senden Sie die ausstehenden Produkte",
    noProductsAvailable: "Keine Produkte verfügbar",
    oldPasswordRequired: "Altes Passwort ist erforderlich",
    newPasswordRequired: "Neues Passwort ist erforderlich",
    newPasswordTooShort: "Neues Passwort muss mindestens 4 Zeichen lang sein",
    newPasswordTooLong: "Neues Passwort darf 50 Zeichen nicht überschreiten",
    newPasswordDifferentFromOld: "Neues Passwort muss sich vom alten unterscheiden",
    userNotFound: "Benutzer nicht gefunden",
    invalidOldWithdrawalPassword: "Das alte Auszahlungspasswort ist falsch",
    updatePasswordFailed: "Passwortaktualisierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    productNotFound: "Produkt nicht gefunden",
    invalidPriceOrCommission: "Ungültige Preis- oder Provisionswerte",
    invalidPriceRange: "Ungültige Mindest- oder Höchstwerte für die Preisgenerierung",
    cleanDatabaseOnlyForTest: "Datenbankbereinigung nur im Testmodus erlaubt",
    stripeLineItemPriceIdNull: "Stripe line_items.data[0].price.id fehlt",
    noRecordsToComplete: "Keine Datensätze zum Abschließen gefunden",
    noPendingRecord: "Kein ausstehender Datensatz gefunden"
  },

  auth: {
    userNotFound: `Entschuldigung, wir erkennen Ihre Anmeldedaten nicht`,
    wrongPassword: `Entschuldigung, wir erkennen Ihre Anmeldedaten nicht`,
    weakPassword: 'Dieses Passwort ist zu schwach',
    emailAlreadyInUse: 'Benutzername wird bereits verwendet',
    invitationCode: 'Bitte geben Sie einen korrekten Einladungscode ein',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse an',
    passwordReset: {
      invalidToken: 'Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen',
      error: `E-Mail nicht erkannt`,
    },
    emailAddressVerificationEmail: {
      invalidToken: 'Der E-Mail-Bestätigungslink ist ungültig oder abgelaufen.',
      error: `E-Mail nicht erkannt.`,
      signedInAsWrongUser: `Diese E-Mail-Bestätigung wurde an {0} gesendet, aber Sie sind als {1} angemeldet.`,
    },
    passwordChange: {
      invalidPassword: 'Das alte Passwort ist ungültig',
    },
  },

  user: {
    errors: {
      userAlreadyExists: 'Ein Benutzer mit dieser E-Mail existiert bereits.',
      userNotFound: 'Benutzer nicht gefunden.',
      destroyingHimself: `Sie können sich nicht selbst löschen.`,
      revokingOwnPermission: `Sie können Ihre eigenen Administratorberechtigungen nicht widerrufen.`,
      revokingPlanUser: `Sie können die Administratorberechtigungen des Planmanagers nicht widerrufen.`,
      destroyingPlanUser: `Sie können den Planmanager nicht löschen.`,
    },
  },

  tenant: {
    exists: 'Es gibt bereits einen Arbeitsbereich in dieser Anwendung.',
    url: {
      exists: 'Diese Arbeitsbereichs-URL wird bereits verwendet.',
    },
    invitation: {
      notSameEmail: `Diese Einladung wurde an {0} gesendet, aber Sie sind als {1} angemeldet.`,
    },
    planActive: `Es gibt einen aktiven Plan für diesen Arbeitsbereich. Bitte kündigen Sie zuerst den Plan.`,
    stripeNotConfigured: 'Stripe ist nicht konfiguriert.',
  },

  importer: {
    errors: {
      invalidFileEmpty: 'Die Datei ist leer',
      invalidFileExcel: 'Nur Excel-Dateien (.xlsx) sind erlaubt',
      invalidFileUpload: 'Ungültige Datei. Stellen Sie sicher, dass Sie die neueste Version der Vorlage verwenden.',
      importHashRequired: 'Import-Hash ist erforderlich',
      importHashExistent: 'Daten wurden bereits importiert',
    },
  },

  errors: {
    notFound: {
      message: 'Nicht gefunden',
    },
    forbidden: {
      message: 'Verboten',
    },
    validation: {
      message: 'Ein Fehler ist aufgetreten',
    },
  },

  email: {
    error: `E-Mail-Anbieter ist nicht konfiguriert.`,
  },

  preview: {
    error: 'Entschuldigung, dieser Vorgang ist im Vorschaumodus nicht erlaubt.',
  },
};

export default de;
