/**
 * I18n dictionary for the en.
 */

const it = {
  app: {
    title: 'Nowspeed',
  },

  validation: {
    withdrawalMethodRequired: "Seleziona un metodo di prelievo (Banca o Crypto) prima di inviare la richiesta",

    withdrawNotAllowed: "I prelievi sono attualmente disabilitati per il tuo account. Contatta l'assistenza clienti",

    minimumBalanceRequired: "Devi mantenere il saldo minimo richiesto dopo il prelievo",

    missingWalletDetails: "Completa le informazioni del tuo wallet prima di inviare una richiesta di prelievo crypto",

    missingERC20Address: "Collega il tuo indirizzo wallet ERC20 prima di inviare una richiesta di prelievo",

    missingTRC20Address: "Collega il tuo indirizzo wallet TRC20 prima di inviare una richiesta di prelievo",

    inValidWithdrawPassword: 'Your withdraw Password is not correct please check again',
    missingBankDetails: 'Per favore aggiungi i tuoi dati bancari prima di effettuare un prelievo',
    missingWithdrawalMethod: 'Per favore aggiungi un portafoglio crypto o i dati bancari prima di effettuare un prelievo',
    exceedsBalance: 'It looks like your withdrawal amount exceeds your balance',
    missingWalletAddress: 'Please go to the "Wallet" section to bind your USDT (TRC20) or ERC20 address before submitting a withdrawal request.',
    requiredAmount: 'Please write amount',
    notFoundTransaction: 'Transaction not found',
    permissoin: "Please try to contact the customer Support for help",
    duplicateSubsctription: 'You have already subscribed to this plan',
    InsufficientBalance: 'Insufficient balance',
    requiredSubscription: 'Please select a subscription plan',
    moretasks: 'This is your limit. Please contact customer support for more tasks',
    deposit: "Insufficient balance please upgrade.",
    insufficientBalanceMin: "Il tuo saldo deve essere di almeno €{0} per continuare.",
    submitPendingProducts: "Per favore invia i prodotti in sospeso",
    noProductsAvailable: "Nessun prodotto disponibile",
    oldPasswordRequired: "La vecchia password è richiesta",
    newPasswordRequired: "La nuova password è richiesta",
    newPasswordTooShort: "La nuova password deve contenere almeno 4 caratteri",
    newPasswordTooLong: "La nuova password non deve superare i 50 caratteri",
    newPasswordDifferentFromOld: "La nuova password deve essere diversa dalla vecchia",
    userNotFound: "Utente non trovato",
    invalidOldWithdrawalPassword: "La vecchia password di prelievo è errata",
    updatePasswordFailed: "Aggiornamento della password non riuscito. Per favore riprova.",
    productNotFound: "Prodotto non trovato",
    invalidPriceOrCommission: "Valori di prezzo o commissione non validi",
    invalidPriceRange: "Valori min/max non validi per la generazione del prezzo",
    cleanDatabaseOnlyForTest: "Pulizia del database consentita solo in modalità test",
    stripeLineItemPriceIdNull: "Mancante Stripe line_items.data[0].price.id",
    noRecordsToComplete: "Nessun record da completare trovato",
    noPendingRecord: "Nessun record in sospeso trovato"
  },


  auth: {
    userNotFound: `Sorry, we don't recognize your credentials`,
    wrongPassword: `Sorry, we don't recognize your credentials`,
    weakPassword: 'This password is too weak',
    emailAlreadyInUse: 'Username is already in use',
    invitationCode: 'please write a correct invitationCode',
    invalidEmail: 'Please provide a valid email',
    passwordReset: {
      invalidToken:
        'Password reset link is invalid or has expired',
      error: `Email not recognized`,
    },
    emailAddressVerificationEmail: {
      invalidToken:
        'Email verification link is invalid or has expired.',
      error: `Email not recognized.`,
      signedInAsWrongUser: `This email confirmation was sent to {0} but you're signed in as {1}.`,
    },
    passwordChange: {
      invalidPassword: 'The old password is invalid',
    },
  },

  user: {
    errors: {
      userAlreadyExists:
        'User with this email already exists.',
      userNotFound: 'User not found.',
      destroyingHimself: `You can't delete yourself.`,
      revokingOwnPermission: `You can't revoke your own admin permission.`,
      revokingPlanUser: `You can't revoke the admin permission of the plan manager.`,
      destroyingPlanUser: `You can't delete the plan manager.`,
    },
  },

  tenant: {
    exists:
      'There is already a workspace on this application.',
    url: {
      exists: 'This workspace URL is already in use.',
    },
    invitation: {
      notSameEmail: `This invitation was sent to {0} but you're signed in as {1}.`,
    },
    planActive: `There is a plan active for this workspace. Please cancel the plan first.`,
    stripeNotConfigured: 'Stripe is not configured.',
  },

  importer: {
    errors: {
      invalidFileEmpty: 'The file is empty',
      invalidFileExcel:
        'Only excel (.xlsx) files are allowed',
      invalidFileUpload:
        'Invalid file. Make sure you are using the last version of the template.',
      importHashRequired: 'Import hash is required',
      importHashExistent: 'Data has already been imported',
    },
  },

  errors: {
    notFound: {
      message: 'Not Found',
    },
    forbidden: {
      message: 'Forbidden',
    },
    validation: {
      message: 'An error occurred',
    },
  },

  email: {
    error: `Email provider is not configured.`,
  },

  preview: {
    error:
      'Sorry, this operation is not allowed in preview mode.',
  },

  entities: {
    association: {
      errors: {
        unique: {

        }
      }
    },
    mandat: {
      errors: {
        unique: {

        }
      }
    },
    categorieMouv: {
      errors: {
        unique: {

        }
      }
    },
    mouvements: {
      errors: {
        unique: {

        }
      }
    },
    campagne: {
      errors: {
        unique: {

        }
      }
    },
    detailsCampagne: {
      errors: {
        unique: {
          adherent: 'Adherent must be unique',
          adherentId: 'Adherent must be unique',
        }
      }
    },
    palier: {
      errors: {
        unique: {

        }
      }
    },
    historiquePoints: {
      errors: {
        unique: {

        }
      }
    },
    projet: {
      errors: {
        unique: {

        }
      }
    },
    votes: {
      errors: {
        unique: {

        }
      }
    },
    dons: {
      errors: {
        unique: {

        }
      }
    },
    produitCategorie: {
      errors: {
        unique: {

        }
      }
    },
    produit: {
      errors: {
        unique: {

        }
      }
    },
    produitCommande: {
      errors: {
        unique: {

        }
      }
    },
  }
};

export default it;
