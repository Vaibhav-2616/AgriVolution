/* Simple i18n translations for the site
   Provides window.I18N.t(key) and window.I18N.setLang(lang)
*/
(function(){
  const TRANSLATIONS = {
    en: {
      'nav.home':'Home',
      'nav.marketplace':'Marketplace',
      'nav.community':'Community',
      'nav.learning':'Learning Hub',
      'nav.mandi':'Mandi Locator',
      'nav.signin':'Sign in',

      'hero.badge':'Future of Farming is Here',
      'hero.title':'Cultivating Prosperity Together',
      'hero.lead':'Join India\'s smartest agriculture platform. Connect with buyers, get AI-powered crop advice, and track real-time mandi prices.',
      'btn.explore':'Explore Marketplace',
      'btn.join':'Join Community',
      'btn.startSelling':'Start Selling →',

      'btn.view':'View',
      'btn.buyNow':'Buy Now',
      'btn.send':'Send',

      'footer.about':'Empowering farmers with technology, community, and market access.',

      'prices.title':'Mandi Prices Today',
      'prices.subtitle':'Daily average prices from local markets',

      'why.title':'Why AGRIVOLUTION?',
      'why.secure':'Secure Payments — Direct bank transfers with escrow protection.',
      'why.rates':'Best Market Rates — Real-time mandi data to help you sell better.',
      'why.ai':'AI Advisory — Instant crop diagnosis and farming tips.',

      'features.title':'Direct from Farm to Table',
      'community.title':'A Community That Grows Together',
      'community.lead':'Farming doesn\'t have to be lonely. Join thousands of farmers sharing stories, tips, and daily wins — ask questions, get reliable advice, and celebrate harvests together.',
      'community.li1':'Peer-led discussions & real farmer experiences',
      'community.li2':'Market tips and mandi price insights',
      'community.li3':'Practical how-tos and local best practices',

      'footer.platform':'Platform',
      'footer.support':'Support',
      'footer.legal':'Legal',
      'footer.email':'hello@agrivolution.example',
      'footer.privacy':'Privacy',
      'footer.terms':'Terms',

      'chat.greeting':'Namaste! I am Arnak, your AI farming assistant. How can I help you today?',
      'chat.placeholder':'Ask about crops...',
      'prices.fromYest':'from yest.',
      'veg.Tomato':'Tomato',
      'veg.Onion':'Onion',
      'veg.Potato':'Potato',
      'veg.Spinach':'Spinach',
      'veg.Carrot':'Carrot',
      'unit.kg':'kg',
      'unit.bunch':'bunch',
      'unit.quintal':'quintal'
    },
    hi: {
      'nav.home':'होम',
      'nav.marketplace':'मार्केटप्लेस',
      'nav.community':'समुदाय',
      'nav.learning':'लर्निंग हब',
      'nav.mandi':'मंडी लोकेटर',
      'nav.signin':'साइन इन',

      'hero.badge':'कृषि का भविष्य यहाँ है',
      'hero.title':'एक साथ समृद्धि उगाएँ',
      'hero.lead':'भारत का सबसे स्मार्ट कृषि प्लेटफ़ॉर्म में शामिल हों। खरीदारों से जुड़ें, AI-सहायता प्राप्त करें, और मंडी की रीयल-टाइम कीमतें देखें।',
      'btn.explore':'बाज़ार देखें',
      'btn.join':'समुदाय में शामिल हों',
      'btn.startSelling':'बेचना शुरू करें →',

      'btn.view':'देखें',
      'btn.buyNow':'अभी खरीदें',
      'btn.send':'भेजें',

      'footer.about':'टेक्नोलॉजी, समुदाय और बाजार पहुँच के साथ किसानों को सशक्त बनाना।',

      'prices.title':'मंडी आज की कीमतें',
      'prices.subtitle':'स्थानीय बाजारों की दैनिक औसत कीमतें',

      'why.title':'क्यों AGRIVOLUTION?',
      'why.secure':'सुरक्षित भुगतान — एस्क्रो सुरक्षा के साथ सीधे बैंक ट्रांसफर।',
      'why.rates':'सर्वश्रेष्ठ बाजार दरें — रीयल-टाइम मंडी डेटा।',
      'why.ai':'AI सलाह — त्वरित फ़सल निदान और खेती सुझाव।',

      'features.title':'खेती से सीधे मेज़ तक',
      'community.title':'एक ऐसा समुदाय जो साथ बढ़ता है',
      'community.lead':'खेती अकेली नहीं होनी चाहिए। हजारों किसानों से जुड़ें जो अपने अनुभव साझा करते हैं—प्रश्न पूछें और सलाह पाएं।',
      'community.li1':'किसानों द्वारा चलायी गई चर्चाएँ',
      'community.li2':'बाजार टिप्स और मंडी कीमतों की जानकारी',
      'community.li3':'व्यावहारिक कैसे-करे गाइड',

      'footer.platform':'प्लेटफ़ॉर्म',
      'footer.support':'सहायता',
      'footer.legal':'कानूनी',
      'footer.email':'hello@agrivolution.example',
      'footer.privacy':'गोपनीयता',
      'footer.terms':'नियम',

      'chat.greeting':'नमस्ते! मैं Arnak हूँ, आपका AI खेती सहायक। मैं कैसे मदद कर सकता हूँ?',
      'chat.placeholder':'फ़सलों के बारे में पूछें...',
      'prices.fromYest':'कल की तुलना में',
      'veg.Tomato':'टमाटर',
      'veg.Onion':'प्याज',
      'veg.Potato':'आलू',
      'veg.Spinach':'पालक',
      'veg.Carrot':'गाजर',
      'unit.kg':'किलो',
      'unit.bunch':'गड्डी',
      'unit.quintal':'क्विंटल'
    },
    or: {
      'nav.home':'ହୋମ୍',
      'nav.marketplace':'ମାର୍କେଟ୍',
      'nav.community':'ସମୁଦାୟ',
      'nav.learning':'ଲର୍ଣିଙ୍ଗ୍ ହବ୍',
      'nav.mandi':'ମଣ୍ଡି ଲୋକେଟର',
      'nav.signin':'ସାଇନ୍ ଇନ୍',

      'hero.badge':'ଏଠାରେ କୃଷିର ଭବିଷ୍ୟତ୍',
      'hero.title':'ସହଯୋଗରେ ସମୃଦ୍ଧି ଉଦ୍ଭବ',
      'hero.lead':'ଭାରତର ସବୁଠାରୁ ସ୍ମାର୍ଟ କୃଷି ପ୍ଲାଟଫର୍ମରେ ଯୋଗଦିଅନ୍ତୁ। କ୍ରାୟକାରୀଙ୍କ ସହିତ ଯୁକ୍ତ ହୁଅନ୍ତୁ, AI ସହାୟତା ପାଆନ୍ତୁ, ଏବଂ ମଣ୍ଡି ମୂଲ୍ୟ ଟ୍ରାକ୍ କରନ୍ତୁ।',
      'btn.explore':'ମାର୍କେଟ୍ ଦେଖନ୍ତୁ',
      'btn.join':'ସମୁଦାୟ ଯୋଗଦିଅନ୍ତୁ',
      'btn.startSelling':'ବେଚିବା ଆରମ୍ଭ କରନ୍ତୁ →',

      'btn.view':'ଦେଖନ୍ତୁ',
      'btn.buyNow':'ଏବେ କିଣନ୍ତୁ',
      'btn.send':'ପଠାନ୍ତୁ',

      'footer.about':'ପ୍ରଯୁକ୍ତି, ସମୁଦାୟ ଏବଂ ବଜାର ପହଞ୍ଚ ସହ ଚାଷୀଙ୍କୁ ସଶକ୍ତ କରାଯାଉଛି।',

      'prices.title':'ମଣ୍ଡି ଆଜିର ଦାମ',
      'prices.subtitle':'ସ୍ଥାନୀୟ ବଜାରର ଦୈନିକ ସାଧାରଣ ମୂଲ୍ୟ',

      'why.title':'କେମିତି AGRIVOLUTION?',
      'why.secure':'ନିରାପଦ ପେମେଣ୍ଟ — ଏସ୍କ୍ରୋ ସୁରକ୍ଷା ସହିତ ସିଧା ବ୍ୟାଙ୍କ ଟ୍ରାନ୍ସଫର।',
      'why.rates':'ଶ୍ରେଷ୍ଠ ବଜାର ଦର — ରିୟଲ୍-ଟାଇମ୍ ମଣ୍ଡି ତଥ୍ୟ।',
      'why.ai':'AI ସଲାହ — ତୁରନ୍ତ ଫସଲ ନିଦାନ ଏବଂ କୃଷି ପରାମର୍ଶ।',

      'features.title':'କୃଷିରୁ ଟେବୁଲ୍ ପର୍ଯ୍ୟନ୍ତ',
      'community.title':'ଏକ ସମୁଦାୟ ଯାହା ସହିତ ବୃଦ୍ଧି ପାଏ',
      'community.lead':'କୃଷି ଏକାକୀ ହେବା ଉଚିତ୍ ନୁହେଁ। ହଜାର ଚାଷୀଙ୍କ ସହିତ ଯୋଗଦିଅନ୍ତୁ ଯେଉଁମାନେ ତାଙ୍କର ଅନୁଭବ ସେୟାର କରନ୍ତି।',
      'community.li1':'ଚାଷୀ ଲେଡ୍ ଆଲୋଚନା',
      'community.li2':'ବଜାର ସୁଚନା ଏବଂ ମଣ୍ଡି ମୂଲ୍ୟ ସୂଚନା',
      'community.li3':'ଆଚରଣ ଉପଯୁକ୍ତ କାର୍ଯ୍ୟବଳୀ',

      'footer.platform':'ପ୍ଲାଟଫର୍ମ',
      'footer.support':'ସମର୍ଥନ',
      'footer.legal':'କାନୁନୀ',
      'footer.email':'hello@agrivolution.example',
      'footer.privacy':'ଗୋପନୀୟତା',
      'footer.terms':'ନୀତିଗତ ନିୟମ',

      'chat.greeting':'ନମସ୍କାର! ମୁଁ Arnak, ଆପଣଙ୍କର AI କୃଷି ସହାୟକ। କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
      'chat.placeholder':'ଫସଲ ସଂପର୍କରେ ପଚାରନ୍ତୁ...',
      'prices.fromYest':'ଗତକାଲ ସହିତ ତୁଳନାରେ',
      'veg.Tomato':'ଟମାଟର',
      'veg.Onion':'ପିଆଜ',
      'veg.Potato':'ଆଳୁ',
      'veg.Spinach':'ପାଲଙ୍କ',
      'veg.Carrot':'ଗାଜର',
      'unit.kg':'କି.ଗ୍ରା',
      'unit.bunch':'ଗଛ',
      'unit.quintal':'କ୍ୱିଣ୍ଟାଲ୍'
    }
  };

  const i18n = {
    lang: localStorage.getItem('agri-lang') || 'en',
    t(key, l){
      const lang = l || this.lang || 'en';
      return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) || key;
    },
    setLang(l){ this.lang = l; localStorage.setItem('agri-lang', l); }
  };

  window.I18N = i18n;
})();
