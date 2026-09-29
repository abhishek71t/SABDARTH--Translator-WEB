import { ShabdarthResult, WordOfTheDay } from '../types/shabdarth';

export const LOCAL_DICTIONARY: Record<string, ShabdarthResult> = {
  'दुरुह': {
    query: 'दुरुह',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'दुरुह',
    normalized: 'दुरुह',
    simpleHindi: 'कठिन या जिसे समझना बहुत मुश्किल हो',
    synonyms: ['कठिन', 'जटिल', 'पेचीदा', 'गूढ़', 'गंभीर'],
    englishMeanings: ['Difficult', 'Complex', 'Abstruse', 'Hard to comprehend'],
    example: 'यह दार्शनिक विषय आम पाठक के लिए अत्यंत दुरुह है।',
    wordType: 'विशेषण (Adjective)',
    pronunciation: 'duruh'
  },
  'वक्तव्य': {
    query: 'वक्तव्य',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'वक्तव्य',
    normalized: 'वक्तव्य',
    simpleHindi: 'कही गई बात, बयान या आधिकारिक कथन',
    synonyms: ['बयान', 'कथन', 'भाषण', 'बात', 'राय'],
    englishMeanings: ['Statement', 'Declaration', 'Speech', 'Remarks'],
    example: 'मंत्री जी का वक्तव्य कल समाचार पत्रों में प्रकाशित हुआ।',
    wordType: 'संज्ञा (Noun)',
    pronunciation: 'vaktavya'
  },
  'प्रभावशाली': {
    query: 'प्रभावशाली',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'प्रभावशाली',
    normalized: 'प्रभावशाली',
    simpleHindi: 'जिसका बहुत गहरा या अच्छा असर पड़े',
    synonyms: ['असरदार', 'ताकतवर', 'प्रभावी', 'सशक्त'],
    englishMeanings: ['Impactful', 'Influential', 'Impressive', 'Effective'],
    example: 'उनका भाषण श्रोताओं पर अत्यंत प्रभावशाली सिद्ध हुआ।',
    wordType: 'विशेषण (Adjective)',
    pronunciation: 'prabhavshali'
  },
  'संबल': {
    query: 'संबल',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'संबल',
    normalized: 'संबल',
    simpleHindi: 'मुश्किल समय में मिलने वाला सहारा या आधार',
    synonyms: ['सहारा', 'आश्रय', 'मदद', 'टेक'],
    englishMeanings: ['Support', 'Prop', 'Sustenance', 'Pillar of strength'],
    example: 'माता-पिता का आशीर्वाद ही उसकी कठिन यात्रा में संबल बना।',
    wordType: 'संज्ञा (Noun)',
    pronunciation: 'sambal'
  },
  'जिज्ञासा': {
    query: 'जिज्ञासा',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'जिज्ञासा',
    normalized: 'जिज्ञासा',
    simpleHindi: 'कुछ नया जानने या सीखने की गहरी चाहत',
    synonyms: ['उत्सुकता', 'कौतूहल', 'जानने की इच्छा'],
    englishMeanings: ['Curiosity', 'Inquisitiveness', 'Desire to learn'],
    example: 'बच्चों में प्रकृति को लेकर असीम जिज्ञासा होती है।',
    wordType: 'संज्ञा (Noun)',
    pronunciation: 'jigyasa'
  },
  'नैसर्गिक': {
    query: 'नैसर्गिक',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'नैसर्गिक',
    normalized: 'नैसर्गिक',
    simpleHindi: 'जो कुदरती या स्वाभाविक हो, बनावटी न हो',
    synonyms: ['प्राकृतिक', 'कुदरती', 'स्वाभाविक', 'जन्मजात'],
    englishMeanings: ['Natural', 'Innate', 'Inherent', 'Spontaneous'],
    example: 'कश्मीर की नैसर्गिक सुंदरता हर किसी का मन मोह लेती है।',
    wordType: 'विशेषण (Adjective)',
    pronunciation: 'naisargik'
  },
  'अप्रतिहत': {
    query: 'अप्रतिहत',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'अप्रतिहत',
    normalized: 'अप्रतिहत',
    simpleHindi: 'जिसे कोई रोक न सके, बिना किसी बाधा के चलने वाला',
    synonyms: ['अजेय', 'निर्बाध', 'अदम्य', 'बेरोक-टोक'],
    englishMeanings: ['Unimpeded', 'Unstoppable', 'Invincible', 'Unchecked'],
    example: 'उनका अप्रतिहत उत्साह सभी युवाओं के लिए प्रेरणा बन गया।',
    wordType: 'विशेषण (Adjective)',
    pronunciation: 'apratihat'
  },
  'कठिन': {
    query: 'कठिन',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'कठिन',
    normalized: 'कठिन',
    simpleHindi: 'जो आसान न हो, जिसे करने में काफी जोर लगे',
    synonyms: ['मुश्किल', 'दुष्कर', 'पेचीदा', 'जटिल'],
    englishMeanings: ['Difficult', 'Hard', 'Tough'],
    example: 'कठिन परिश्रम ही सफलता की असली कुंजी है।',
    wordType: 'विशेषण (Adjective)',
    pronunciation: 'kathin'
  },
  'मुश्किल': {
    query: 'मुश्किल',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'मुश्किल',
    normalized: 'मुश्किल',
    simpleHindi: 'कठिन कार्य या ऐसी स्थिति जिससे पार पाना आसान न हो',
    synonyms: ['कठिनाई', 'विपत्ति', 'दुविधा', 'दिक्कत'],
    englishMeanings: ['Problem', 'Difficulty', 'Hardship'],
    example: 'धैर्य से काम लें तो हर मुश्किल आसान हो जाती है।',
    wordType: 'संज्ञा / विशेषण',
    pronunciation: 'mushkil'
  },
  'अथाह': {
    query: 'अथाह',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'अथाह',
    normalized: 'अथाह',
    simpleHindi: 'जिसकी गहराई या सीमा नापी न जा सके, बहुत ज्यादा',
    synonyms: ['अगाध', 'बेहद', 'असीम', 'गहरा'],
    englishMeanings: ['Fathomless', 'Boundless', 'Immense', 'Deep'],
    example: 'समुद्र में अथाह जलराशि समाई हुई है।',
    wordType: 'विशेषण (Adjective)',
    pronunciation: 'athaah'
  },
  'परिष्कार': {
    query: 'परिष्कार',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'परिष्कार',
    normalized: 'परिष्कार',
    simpleHindi: 'सुधार करना, साफ-सुथरा या बेहतर बनाना',
    synonyms: ['सुधार', 'शुद्धि', 'संशोधन', 'निखार'],
    englishMeanings: ['Refinement', 'Purification', 'Improvement'],
    example: 'निरंतर अभ्यास से लेखन शैली का परिष्कार होता है।',
    wordType: 'संज्ञा (Noun)',
    pronunciation: 'parishkaar'
  },
  'उल्लास': {
    query: 'उल्लास',
    isSentence: false,
    detectedLanguage: 'hindi',
    original: 'उल्लास',
    normalized: 'उल्लास',
    simpleHindi: 'बहुत अधिक खुशी और जोश की भावना',
    synonyms: ['खुशी', 'आनंद', 'हर्ष', 'उमंग'],
    englishMeanings: ['Exuberance', 'Joy', 'Elation', 'Cheerfulness'],
    example: 'त्योहार के अवसर पर पूरे गांव में उल्लास छाया हुआ था।',
    wordType: 'संज्ञा (Noun)',
    pronunciation: 'ullaas'
  }
};

// Common sentence examples from PRD
export const SAMPLE_SENTENCES: Record<string, ShabdarthResult> = {
  'उसका वक्तव्य अत्यंत प्रभावशाली था।': {
    query: 'उसका वक्तव्य अत्यंत प्रभावशाली था।',
    isSentence: true,
    detectedLanguage: 'hindi',
    original: 'उसका वक्तव्य अत्यंत प्रभावशाली था।',
    normalized: 'उसका वक्तव्य अत्यंत प्रभावशाली था।',
    originalSentence: 'उसका वक्तव्य अत्यंत प्रभावशाली था।',
    simpleHindi: 'उसकी बात बहुत असरदार थी।',
    keyWords: [
      { word: 'वक्तव्य', meaning: 'कही गई बात या भाषण', english: 'Statement / speech' },
      { word: 'अत्यंत', meaning: 'बहुत ज्यादा या काफी', english: 'Extremely / very' },
      { word: 'प्रभावशाली', meaning: 'जिसका गहरा असर पड़े', english: 'Impactful / influential' }
    ],
    english: 'His statement was very impactful.',
    example: 'उसकी बात सुनकर सभी लोग सहमत हो गए।'
  },
  'वह इस पुस्तक को पढ़ने में सफल हुआ।': {
    query: 'वह इस पुस्तक को पढ़ने में सफल हुआ।',
    isSentence: true,
    detectedLanguage: 'hindi',
    original: 'वह इस पुस्तक को पढ़ने में सफल हुआ।',
    normalized: 'वह इस पुस्तक को पढ़ने में सफल हुआ।',
    originalSentence: 'वह इस पुस्तक को पढ़ने में सफल हुआ।',
    simpleHindi: 'वह इस किताब को पढ़कर कामयाब हो गया।',
    keyWords: [
      { word: 'पुस्तक', meaning: 'किताब', english: 'Book' },
      { word: 'सफल', meaning: 'कामयाब या लक्ष्य हासिल कर लिया', english: 'Successful' }
    ],
    english: 'He succeeded in reading this book.',
    example: 'लगातार प्रयास से वह कठिन काम पूरा करने में सफल हुआ।'
  }
};

export const POPULAR_SUGGESTIONS: Record<string, string[]> = {
  'म': ['मुझे आज', 'मैं घर जा रहा हूँ', 'मेरे पास एक पुस्तक है', 'मनुष्य का स्वभाव', 'मधुर वाणी'],
  'मु': ['मुझे आज', 'मुझे आज स्कूल जाना है।', 'मुझे आज पढ़ाई करनी है।', 'मुझे आज बाजार जाना है।', 'मुश्किल समय में हिम्मत मत हारो।'],
  'मुझे': ['मुझे आज स्कूल जाना है।', 'मुझे आज पढ़ाई करनी है।', 'मुझे आज बाजार जाना है।', 'मुझे इसका सरल मतलब बताओ।', 'मुझे हिंदी भाषा बहुत प्रिय है।'],
  'मुझे आज': ['मुझे आज स्कूल जाना है।', 'मुझे आज पढ़ाई करनी है।', 'मुझे आज बाजार जाना है।', 'मुझे आज नया पाठ सीखना है।'],
  'वह': ['वह इस पुस्तक को पढ़ने में सफल हुआ।', 'वह बहुत परिश्रम करता है।', 'वह अपने लक्ष्य के प्रति समर्पित है।'],
  'उसका': ['उसका वक्तव्य अत्यंत प्रभावशाली था।', 'उसका विचार बहुत सुंदर है।', 'उसका व्यवहार सभी को भा गया।'],
  'क': ['कठिन मार्ग', 'कर्तव्य का पालन', 'कर्म ही पूजा है', 'कल का दिन मंगलमय हो'],
  'कठिन': ['कठिन परिश्रम ही सफलता दिलाता है।', 'कठिन शब्दों का सरल अर्थ।', 'कठिन राह भी आसान हो जाती है।'],
  'dur': ['दुरुह विषय को सरल बनाएं', 'दूरी कम हो गई', 'दुर्लभ अवसर मिला'],
  'kathin': ['कठिन कार्य को धैर्य से करें', 'कठिन परीक्षा में सफलता', 'कठिन समय भी बीत जाता है']
};

export const WORDS_OF_THE_DAY: WordOfTheDay[] = [
  {
    word: 'दुरुह',
    pronunciation: 'duruh',
    meaning: 'कठिन या जिसे समझना बहुत मुश्किल हो',
    simpleHindi: 'जिसे समझना आसान न हो',
    synonyms: ['कठिन', 'जटिल', 'पेचीदा', 'गूढ़'],
    englishMeanings: ['Difficult', 'Abstruse', 'Complex'],
    example: 'यह दार्शनिक विषय आम पाठक के लिए अत्यंत दुरुह है।',
    quote: 'दुरुह मार्ग भी दृढ संकल्प से सुगम बन जाता है।',
    themeTag: 'साहित्यिक शब्द (Literary Gem)'
  },
  {
    word: 'संबल',
    pronunciation: 'sambal',
    meaning: 'मुश्किल घड़ी में सहारा या सहारा देने वाली शक्ति',
    simpleHindi: 'कठिन समय में मिलने वाला सहारा',
    synonyms: ['सहारा', 'आश्रय', 'बल', 'टेक'],
    englishMeanings: ['Support', 'Pillar of strength', 'Sustenance'],
    example: 'मित्र की सहानुभूति उसके दुख में संबल बन गई।',
    quote: 'विश्वास ही मनुष्य के जीवन का सबसे बड़ा संबल है।',
    themeTag: 'प्रेरणादायक शब्द (Inspirational)'
  },
  {
    word: 'जिज्ञासा',
    pronunciation: 'jigyasa',
    meaning: 'कुछ नया जानने और सीखने की आंतरिक अभिलाषा',
    simpleHindi: 'नई बातें जानने की गहरी चाह',
    synonyms: ['उत्सुकता', 'कौतूहल', 'इच्छा'],
    englishMeanings: ['Curiosity', 'Quest for knowledge'],
    example: 'वैज्ञानिक खोजों की जननी मनुष्य की जिज्ञासा ही है।',
    quote: 'जिज्ञासा ज्ञान के द्वार खोलने वाली सुनहरी कुंजी है।',
    themeTag: 'ज्ञान और विचार (Wisdom)'
  },
  {
    word: 'नैसर्गिक',
    pronunciation: 'naisargik',
    meaning: 'प्रकृति से उत्पन्न या कुदरती गुण से संपन्न',
    simpleHindi: 'कुदरती और स्वाभाविक, जो बनावटी न हो',
    synonyms: ['प्राकृतिक', 'स्वाभाविक', 'सहज', 'कुदरती'],
    englishMeanings: ['Natural', 'Innate', 'Spontaneous'],
    example: 'शिशु की मधुर मुस्कान में एक नैसर्गिक आकर्षण होता है।',
    quote: 'नैसर्गिकता में ही सच्चा सौंदर्य और शांति बसती है।',
    themeTag: 'प्रकृति और सौंदर्य (Nature & Grace)'
  }
];

export function getWordOfTheDay(): WordOfTheDay {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length];
}
