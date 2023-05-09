const { FieldValue } = require('@google-cloud/firestore');
const { app, auth, db, messaging, adminsProd, printUser, processTokens } = require('./main');

console.log('Running');
cleanUserNotifProps();

async function resubUsersToTopics() {
  const topic = `/topics/users`;
  const usersSnap = await db.collection(`users`).get();

  usersSnap.docs.forEach(async snap => {
    const user = { id: snap.id, ...snap.data() };

    user.fcmTokens = processTokens(user.fcmTokens);

    if (user.fcmTokens.length > 0) {
      try {
        const res = await messaging.subscribeToTopic(user.fcmTokens, topic);

        if (res?.failureCount > 0) {
          const failedTokens = [];
          const tokensToRemove = [];

          res.errors.forEach(err => {
            // Cleanup the tokens which are not registered anymore.
            if (
              err.error?.code === 'messaging/invalid-registration-token' ||
              err.error?.code === 'messaging/registration-token-not-registered'
            ) {
              tokensToRemove.push(user.fcmTokens[err.index]);
            }
            failedTokens.push(user.fcmTokens[err.index]);
          });

          // Remove invalid tokens
          if (tokensToRemove.length > 0) {
            await snap.ref.update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });

            console.log(`Bad tokens`, tokensToRemove.length);
            console.log(`Good tokens ` + user.fcmTokens.filter(t => !tokensToRemove.includes(t)).length);
            console.log(user.id);
            console.log(tokensToRemove);
          }
        }
      } catch (error) {
        console.log('err subscribeToTopic: ', user.uid, user.fcmTokens);
      }
    }
  });
}

async function cleanUserNotifProps() {
  const usersSnap = await db.collection('users').get();
  let count = 0;

  usersSnap.forEach(async snap => {
    const user = { id: snap.id, ...snap.data() };
    const tokens = processTokens(user.fcmTokens);

    if (tokens.length == 0) {
      // snap.ref.update({ uid: snap.id });
      printUser(user);
      count++;
    }
  });

  console.log(`Count : `, count);
}

async function restoreTokens() {
  const users = [
    {
      uid: '05sVknRMR3VBNrfcwwZJBpsgXgh2',
      fcmTokens: [
        'eP7sgVtNRGyYtDnyGPkkcG:APA91bEB3Wa9r4ncUYYl5jMA4YFtIOs2iLaRx69l_3hvCQkZH-_lTf5sns5z99gu0NGkqG1Z0mhaGqkE5Dz6MWeI4c3pJp1fkN0JpGLpYkaJJh_nYZm49QZhgZZYjjJ8_foXcSIw7CUL',
      ],
    },
    {
      uid: '0UrW0SGuZyXDtuoCGZm2mWdWWE92',
      fcmTokens: [
        'cSClRrE6s0LUg_rNXGybb5:APA91bEzFAlbweDdEu_QiCYFXGNldj9LhEaEfbbKEF5bQGu1tiB971eevrlphF2qWXzvdzU48ZUkk7warTbsuwsVlS6FDP7AFLa7x7BtZlEStHKP3pZjAbij09AJuUPZ4oyxM_yXaTgi',
      ],
    },

    {
      uid: '0azBqnDfNxgWlaa5y5526Y7KRMe2',
      fcmTokens: [
        'dK2QP8IavU3NoMM0UreP_6:APA91bGulQgNXn8EcgLkb9FBL_Xoo-ia49KVRBOTXKstFR3olYwfTUqp5RCCKaepCCXRJ2m5F8RcVeKyVw2uy4uSPXxBld4PFL2cFBPYNn-YHSIf9wQrX882taMBlEAdyEUmiluKAc_Z',
      ],
    },
    {
      uid: '0ghpr2ZkpcXIxPMot3ZGEFN5r3h2',
      fcmTokens: [
        'dD_D4i0Mt0q7hlahc_n0fX:APA91bEQIYsUtCd4o0UZLCku_V0e4E1sD0ZhIahi6O8sjuNViwdDhJ7AjISWfjyRYvgmghIs0DhAZ4BT2anARaOXQ849Fp2jAYp1F30JlJJXKZI-MMNocHUFyLndOUSZ4vzMNR6e3CFa',
        'fPoxu3pBqk5amc00aqmMIl:APA91bHY06E1GRUH-EMBjPxoYezs_k4Hfxgz8kVWBYOj7pokEh8frQ5AarxBydvilf1Vi8B_1UIrLg8Iu-fKelmEL_stXfnxAtXbB5zxAys_7-XQuTUoLq-1ye3L_i3gDZ-sxiXVna4I',
      ],
    },
    {
      uid: '18H1sH8Y7ZQ2Ngysgv3EBXCOTXG3',
      fcmTokens: [
        'eVuJ3xDkC0DFgbMee3xuf2:APA91bGBFsjP7sYFKM_-n_WJ9SSX8M8Ub2Nk6Gp6-PRanLwkfccCYXgvBf-v2rLxhvOpWML2ZXknANzEyqmcy_VT2tPYm0_pprIQWj-DRLngm2GXV-EfMGpLAym8wahfv8EHYyrAmirW',
      ],
    },
    {
      uid: '1QxKrMr1ebQK8knodGH3aMEVjMm2',
      fcmTokens: [
        'cDrmSeuWptDz6rRVYnF-t1:APA91bF4ddNjAN9vNtEDTX5AizNNc3t-bi2d1wAjY5i7ToTkyRMXtRkqEv9xykefgTA9WznJVpzp66RtKp-bLO4nJNY0uM4PhGfRfn4BsGXOUSNaGoc6apoI2begkKepFzHzsaTmeqsW',
        'eTNcsFDJz0lrn71EhWAkt9:APA91bEYw8czaQ7OzDBYHJCUH3GuteOdqjAFeMDuzoHqCkTC9B-G05vBylMP10vmXp44i4YMSz1Vx-2mlSwhvU4TCYZpwMT-rxRKJTuPZQhgNsJ4fUXI3yxP6NH_-osaRk5fGI_H9eep',
      ],
    },
    {
      uid: '1UJdCRlxf4TnI0QWv3qbzMf4Z1u2',
      fcmTokens: [
        'cGD0yKyOQwGNpSHxqUdIKq:APA91bGwAnanB2MRlHiD2_r_MVU7lbeu_kQZcIlyaQQQRL4McSyvSvPSShSpZRWydS2LD_2p4FI1BzVPtjukPzstdgkXb1r0ULIShWbSO-2Onw9ckVV8ZaylaymFqoxC4h-ja5nL542d',
      ],
    },
    {
      uid: '1XvPOWli1FP6jr7c6U0oZatgRky2',
      fcmTokens: [
        'eirI5LvBSwmrxCwPS1DsE2:APA91bFO5lHEDPK8fLCZzvhvAEh8hU9EbXQwh8Kq8hDpSJc8J5gESwY2B72gdohfOx-6daFPfi3yYNzbjFMSASchVslwXYZH_bsmst0AvgrUQZfXrhVHmhaf7XNW1_iDuqrOiO0U0-Wb',
        'eUvkTFLYRFKVyZHWbC2PYW:APA91bHB3aGHiXEk-QQu_P90Fx4l74myFcgSi0UbquVclWWxSer6dXetw5hoQ1rK-6wGU27o89ULMvKmWiMi2b2krTT2KF0Q8X7AkhN_QzELKEJ7wVUBpwPxv2_hSXfV74ma_pGGswzt',
      ],
    },
    {
      uid: '2vB5MkbjZeeaKRKjRvmiKDiHlnm2',
      fcmTokens: [
        'cyKnvXZpaEEmpdWH-B2kem:APA91bGl_lDbTopLs9gjoCH5JEERZ-LZEF8M-_ZoB-gQQ7SoWyacZzjYFz8MYnu3vW_XYgFOIvhic6zRlgN9uOLYjuBT4TnOKoLWCXeEUCBQT78UiaqLN7qpXjQC_TFUS_s0ByVTtRyX',
      ],
    },
    {
      uid: '30MQr9pgbocIkhM8ABPZ2lPcGKq1',
      fcmTokens: [
        'dgZXoSz06oWde4Ux1v8O1X:APA91bHGvV7VOkTkq4VIi1U93-ouv97UGaRBVFnD6cld3B-WuyLQbHGSpjZWC0vZmCwimVE1xJ492kTeI8eBhxfyM-KUc06qUWYLuOxCW4vDJCrFA-2fAjV1aVIrK1f7aWRq5GeSkz_6',
      ],
    },
    {
      uid: '3Cmom9c76XcfpCCUFjyNgK5WNcU2',
      fcmTokens: [
        'elVLn7HbTuasLBmfSIXq0p:APA91bGSXhcpetXljh15LWd41H6HfeZDtN6LJ-M6Ktxs35JJbrkdgLBtxOwBsp_GzPpJ3ot3gzN4jUygaWTzBERb1Ssupohu4u-pPnT39TfATZ1uzNw1xAkJFgAwog6LSBZZu6ld8Qon',
      ],
    },
    {
      uid: '3yczcOO6vpNphPSOHKuWOzbPDnf2',
      fcmTokens: [
        'd3pSv2etR02hIG4zK9mdmz:APA91bEsQQLUaS7j0mCZ2itcrufQ_0NWASmwYdbY3aRToXqipAkX35XJC7CqsnY8UiX0sf5WTh7DvkBZFsaF0AR_RF6VtiSzVDBL-efdqi0oQEPViMY_0rj5JG9cVrV9D9fQcI8Wwqrf',
      ],
    },
    {
      uid: '40bqistBE4edqzkorbFCcJSGXuh1',
      fcmTokens: [
        'c_QYnWVYpknrh5fCuvviyj:APA91bHB0NGxFndJCuSQyZ5iLf7vNNn5C9iiMXOnZ9ObD1sROmuGFlYxW6jVcabXNSeiS68CNPXiYnZM7fGg6yedIA3PdIk8j6eQNsC5KQvGJH_gfczWKTizHSnpImtB4UKeboVsLaU3',
      ],
    },
    {
      uid: '4762vjxJhueybidw3p0BsMWvjus2',
      fcmTokens: [
        'elD_x0ugR_-LMvsZ-7rs50:APA91bFJapTMq8nY28Air762lG3lACDqIc9-O9vQPihs4AAbUrjeqBWaTBDcRooZgrlKxSmEmxF3Xqy77ulGrkCHr_MYarODh16vgJqAcoT5GUrkdAaBKKsOVPoyD49eWw_aPAFwgR56',
      ],
    },
    {
      uid: '47pxp520h4VYdKu9ghLDutdIFkN2',
      fcmTokens: [
        'czOtCe54QuyR9UmRXMejnt:APA91bE7hWPO_7TLR8MlOCLGjOXd_Gx-tVXcfodTaZ6QlQKxxwmF4hIC8H1n3ggLKyR6SxZquOKd94Yplg2_Esy9wgadIZkc_bCZOw91m6NmA0-UJeMNDdFsI24I7wsbZcCNel-oSpdV',
        'ewB4ETeg7UDWukFRiF-xcl:APA91bGkwwFaPjIaT6SsATGR6bfoWGkifbPBikVcP2y0TXzU6LVajh5oyS_ab1Oc4eXXhwIxubwJtwL-5wp5lU-fLMVKow97pCCQDHiA2_6ZVfAndH-9XBpJ5HlUiehN--s4bNagfe7N',
      ],
    },
    {
      uid: '4BgpXHGKF2ZhfcGsYQojsCn769F2',
      fcmTokens: [
        'cfx0DQUuRA6H_wAL9SKRNU:APA91bHGiM_m8kf6AzOWbtSHZ49N2nkiq_9UYWj8oZbI_pFGTCvTAI6Mu9V8X18MW8MHzLal_8z-w6UHe5Wq26A3gn5MJr2fGCKV6Hp9HAIiu6482rpJyx-Aksq4afN9ZULbpXECaVYM',
      ],
    },
    {
      uid: '4HQclmkQ72cI2Ncg3xyiHjZLGkF2',
      fcmTokens: [
        'dihpIWVzRc2-DkK1i22a0j:APA91bE1cLGcFXB9Ae-8rv-8STEBK9Cn6B4pKqozA30TH_tmzqOIbwLIIxthrNBuiQisO09UkaHiv5SfoYyNghVvi8CogjmJB2CJrDryE5KHnt_lBeRXEK_St0HMAkUiNw92PuuAKwaO',
      ],
    },
    {
      uid: '4PiVzuWExceoXkW57AI4lnBIYXe2',
      fcmTokens: [
        'fOVoMI3ze0rVgjQD99aeTG:APA91bGKd6db615daG3JGAYCQLU0CltQn141Y0Rm70Y0ErCheGlVHf_Q4V-k_3W1kMBzfOtZarK6hx46Yl0lEc5KFmfdXesMf0VrH1WEUEovMib-HpRf7FK_gAO4JXatJlMqJJh-9N9M',
        'fFGztLD_MEN2jVWvUtJfqS:APA91bEDw9nI3Wg5zyoX_EuJG-C89uQryz-8gyyZkzsSWKr8Hh88HdyFFtiNtS_EBa6l6leiIjpDtkWSY0a19S34StVPpubjnxiYMbK1Kz5JBeaSLPEg1N2iSLZSTRjPEigWe2WwknyA',
      ],
    },
    {
      uid: '4cIsrlzW5ehO2CYViyT5OgPNrfC2',
      fcmTokens: [
        'eVyWhr0_QCeSTYDm2pdIYS:APA91bEKQI1oMNlNVdoKjjr--spqdJVYpg1tkqSRSoYQUoRme3eeFUlJ0ms1LdAC18OZQGFo-eaXIFfpyjYb1fbyeSU3-ebU2GYw756IwS88ksTtuxHGxd7jvNVpDYpoclmPk_z218go',
      ],
    },
    {
      uid: '4zKPznOq38gyBRd0GAyJ77tqs9Y2',
      fcmTokens: [
        'cJ0HQC5siUsMTmiD0jOxwp:APA91bFW-hbYVfagpMex-U6BxbjMmGyDB_5U1hfzpGlHXxygkuL4dJxyiRzbXCaz5UbJO2JzGBWXYY7dTecdD5es3qWAswvoLRYJx5ZDM0ZpirnSSa5jTyrb6qO6otoI62xzN4LL-Hfc',
      ],
    },
    {
      uid: '57iqlaZ00wfL8aSfaUYXb3raUcv2',
      fcmTokens: [
        'e50S9R9vRzW3p5HiFKVsPI:APA91bFdYqMtb1k0E0rehZgaBe2RBpW5yA3yc3t4i37dT4hZSyQv1uhwTyFYBB8ehh_PnNE_uSRBr4sG7wENA3Q4YIh6dtqGSphqSlNv1HO5CNEhnQiygaIWzRt5kZNJFQo15k5kZk43',
      ],
    },
    {
      uid: '5OWj2JkyiyeVzmdWBJpXZT5iNPw2',
      fcmTokens: [
        'cEpTvDt_QxKHk045NQ5C-U:APA91bH83sO-xe0BRUJUjFHW2vEZ6Z7y5gW9_wxitySB3VYhrMZb72Iy09BXt2xRSQVXYapquKPhGp3pIsqg3aGQM2x6yDHz1SI8prSXV8Pomf6dmdDcBcZbTuF0dfvuoxIGzZff9FWU',
      ],
    },
    {
      uid: '5osDM3ZWZ0Ovvw9jOARD3wesLui2',
      fcmTokens: [
        'fmAx76GPS-CWHzrayrhTjO:APA91bH5EauHy3BLte8QGA4LXdmP0HmIqwf7-14EOKTfg0U78iPumC_QlWhCWg63Cf9d42o9kr3mvURUDE32Yh5b-iGv3mBpEydMcZf_QGOm649aK44RuVGH3XbjK_7E8FcblJauU4Vu',
      ],
    },
    {
      uid: '5qmwJGTEWcOff0HHXVk5jZc0JOl2',
      fcmTokens: [
        'ex63dJiXmETuiCe-WN5aas:APA91bGzfd-nnc69KdSRuShsSJ-jxsQ-YUFYxQ5O0D-PyROabdU7-2aM9FNvTC93C0IwtneKjCICzNgBEglcHK3uHkthoTVq-8SdzI7tiR-8JT_sfUSBdLNhEGPUISOsEXmbQaNonbT1',
        'cHCV4FogPkjFqPGdLSW6Y-:APA91bFJjbeyUasVERCIth5DYIpbQ2q-ez1nvFrht8W_W1i-f6hKkx5IilK5321FIWBkNlr1DHwSzYaIYh3qEK_yxtZ0OjADjpouC78e8z4wnh18XY5vIRfEuWHU2X_EkeKxYLe9ogbP',
        'f-GQUMUOzkRwkVSeHXD1Nw:APA91bFaDFSEyZWUox8dI-XS1-mNBGaNkRu2PE75UlegKCvy1WO2QbGgTMMQFl16ej-JS0-nBJXvpijAWjp2ec-1Hj1l1O_dMDoAcbRN6lWRSBMEaJFpYv_JUPYQ2zAlv8dKXu6JJWMf',
        'eOTyq2_HxnUvB-vHuR4aL5:APA91bFUrV1V-_-SZGuePFpvgEBTXaVo2ZmYllfar6tB3Jy0OV-_y8Jpfle1w5zskm1HBEP7GOf2Ti1dE3XUgMtim1NFHQiYoR2-aiClXpB0XPw8_Ql5YiEJ4euJdIN7ejHJzsfsQpQP',
      ],
    },
    {
      uid: '6NdCNXWwrtRpfpXKAHOkYyKtHrB2',
      fcmTokens: [
        'fs1Gz7H8SIegvJ0tbao3CZ:APA91bElRDRzsn3yfvJq6aBZCTfU3XPIS_5IbL54F8gG_Bh_KvTiD6lrljg5v3HVG540RGsVosoz6PXOUPYFXiT6CKLhIPyJf6L1vhrhrRiqIqNx5K9gWbeEv-mLXpqyeMOmtCrbzv5R',
      ],
    },
    {
      uid: '6RpxJ1OKRhgG2ZGEFUs63KVEfy32',
      fcmTokens: [
        'emPeVW8syEo3oCVgCJLE4B:APA91bH-KuU1s5_lBMJ6LlvVdMdNwtmxT44GDPuL6ssVRvdVLkQ9EmDOSdtKRU4nsnvT_fY-xBNSmLVn6wMpqKNmFu1varW-B2jUUXU1TT8rEuyrrs7xDBdVsuwNJaUVLE0hzMCasV3E',
      ],
    },
  ];

  const uids = users.map(u => u.uid);
  const usersSnap = await db.collection(`users`).limit(50).get();

  console.log('Query Count :', usersSnap.size, users.length);

  usersSnap.docs.forEach(async snap => {
    //
    if (uids.includes(snap.id)) {
      printUser(snap.data());

      const user = users.find(u => u.uid == snap.id);

      await snap.ref.update({ fcmTokens: FieldValue.arrayUnion(...user.fcmTokens) });
    }
  });
}

export async function sendMulticast(msg, uid) {
  if (!environment.notify) {
    return Promise.resolve();
  }
  if (!msg.tokens || msg.tokens?.length == 0) {
    return functions.logger.info(`Tokens null or empty`);
  }

  const batchResponse = await messaging.sendMulticast(msg);

  if (batchResponse.failureCount > 0) {
    const failedTokens = [];
    const tokensToRemove = [];

    batchResponse.responses.forEach((res, idx) => {
      if (!res.success) {
        // Cleanup the tokens which are not registered anymore.
        if (
          res.error?.code === 'messaging/invalid-registration-token' ||
          res.error?.code === 'messaging/registration-token-not-registered'
        ) {
          tokensToRemove.push(msg.tokens[idx]);
        }
        // console.log(`err: `, res.error?.code, res.error?.message, msg.tokens[idx]);
        // note: title, body can't be a number AND token can't be any 'RandomString' -> messaging/invalid-argument err
        failedTokens.push(msg.tokens[idx]);
      }
    });

    // Remove invalid tokens
    console.log(`Summary sendMulticast - uid: ${uid}`);
    console.log('- tokens:', msg.tokens?.length, ' success:', batchResponse.successCount);

    if (tokensToRemove.length > 0) {
      if (uid) {
        await db.doc('users/' + uid).update({ fcmTokens: FieldValue.arrayRemove(...tokensToRemove) });
      }

      console.log(`- tokens to remove:`, tokensToRemove.length, 'failed tokens:', failedTokens.length);
      console.log(tokensToRemove);
    }
  }

  return batchResponse;
}
