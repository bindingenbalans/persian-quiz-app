import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { QUESTIONS, CATEGORIES, QUESTIONS_PER_CATEGORY } from './questions';

const BALANSCOACH_URL = 'https://apps.apple.com/app/id6757333330?l=fa';
const AD_INTERVAL = 2; // Show popup after every 2 categories

// Shuffle function for answers
const shuffleAnswers = (question) => {
  const correctAnswer = question.answers[question.correct];
  const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
  const newCorrectIndex = shuffled.indexOf(correctAnswer);
  return {
    ...question,
    answers: shuffled,
    correct: newCorrectIndex
  };
};

// Get random questions from a category
const getRandomQuestions = (categoryId, count) => {
  const allQuestions = QUESTIONS[categoryId];
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(shuffleAnswers);
};

// Small Banner Component
const SmallBanner = ({ onPress }) => {
  const banners = [
    { emoji: '🥗', text: 'تغذیه سالم با هوش مصنوعی' },
    { emoji: '📸', text: 'عکس بگیر، کالری بدان' },
    { emoji: '🏃', text: 'مربی شخصی سلامت' },
  ];
  const banner = banners[Math.floor(Math.random() * banners.length)];
  
  return (
    <TouchableOpacity style={styles.smallBanner} onPress={onPress}>
      <Text style={styles.smallBannerEmoji}>{banner.emoji}</Text>
      <Text style={styles.smallBannerText}>{banner.text}</Text>
      <Text style={styles.smallBannerApp}>BalansCoach Pro</Text>
    </TouchableOpacity>
  );
};

// Large Popup Component
const AdPopup = ({ visible, onClose, onDownload }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.adModal}>
        <TouchableOpacity style={styles.adCloseButton} onPress={onClose}>
          <Text style={styles.adCloseText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.adEmoji}>🥗</Text>
        <Text style={styles.adTitle}>BalansCoach Pro</Text>
        <Text style={styles.adDescription}>
          مربی هوش مصنوعی برای تغذیه سالم{'\n'}
          عکس بگیر، کالری و مواد مغذی را ببین!
        </Text>
        
        <View style={styles.adFeatures}>
          <View style={styles.adFeature}>
            <Text style={styles.adFeatureEmoji}>📸</Text>
            <Text style={styles.adFeatureText}>تشخیص غذا</Text>
          </View>
          <View style={styles.adFeature}>
            <Text style={styles.adFeatureEmoji}>🎯</Text>
            <Text style={styles.adFeatureText}>اهداف شخصی</Text>
          </View>
          <View style={styles.adFeature}>
            <Text style={styles.adFeatureEmoji}>📊</Text>
            <Text style={styles.adFeatureText}>آمار روزانه</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.adButton} onPress={onDownload}>
          <Text style={styles.adButtonText}>دانلود رایگان</Text>
        </TouchableOpacity>
        <Text style={styles.adSubtext}>۵ آنالیز رایگان در روز</Text>
      </View>
    </View>
  </Modal>
);

export default function App() {
  const [screen, setScreen] = useState('home');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState({});
  const [questions, setQuestions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showSmallBanner, setShowSmallBanner] = useState(false);

  useEffect(() => {
    const initialScore = {};
    CATEGORIES.forEach(cat => {
      initialScore[cat.id] = 0;
    });
    setScore(initialScore);
  }, []);

  // Random small banner visibility
  useEffect(() => {
    setShowSmallBanner(Math.random() > 0.5);
  }, [currentQuestionIndex]);

  const openBalansCoach = () => {
    Linking.openURL(BALANSCOACH_URL);
  };

  const startQuiz = () => {
    const initialScore = {};
    CATEGORIES.forEach(cat => {
      initialScore[cat.id] = 0;
    });
    setScore(initialScore);
    setCurrentCategoryIndex(0);
    setCurrentQuestionIndex(0);
    loadCategoryQuestions(0);
    setScreen('quiz');
  };

  const loadCategoryQuestions = (categoryIndex) => {
    const category = CATEGORIES[categoryIndex];
    const categoryQuestions = getRandomQuestions(category.id, QUESTIONS_PER_CATEGORY);
    setQuestions(categoryQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correct) {
      const category = CATEGORIES[currentCategoryIndex];
      setScore(prev => ({
        ...prev,
        [category.id]: prev[category.id] + 1
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS_PER_CATEGORY - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (currentCategoryIndex < CATEGORIES.length - 1) {
      // Check if we should show ad popup
      const nextCatIndex = currentCategoryIndex + 1;
      if (nextCatIndex % AD_INTERVAL === 0) {
        setShowAdPopup(true);
      }
      setCurrentCategoryIndex(nextCatIndex);
      loadCategoryQuestions(nextCatIndex);
    } else {
      setScreen('results');
    }
  };

  const getTotalScore = () => {
    return Object.values(score).reduce((a, b) => a + b, 0);
  };

  const getMaxScore = () => {
    return CATEGORIES.length * QUESTIONS_PER_CATEGORY;
  };

  const getPercentage = () => {
    return Math.round((getTotalScore() / getMaxScore()) * 100);
  };

  const getTitle = () => {
    const pct = getPercentage();
    if (pct >= 90) return 'شاه ایرانی! 👑';
    if (pct >= 75) return 'ایرانی اصیل! 🦁';
    if (pct >= 60) return 'ایرانی خوب! ☀️';
    if (pct >= 40) return 'نیمه ایرانی! 🌙';
    return 'تازه‌وارد! 🌱';
  };

  const shareResult = async () => {
    const pct = getPercentage();
    const title = getTitle();
    const message = `${title}\n\nمن ${pct}% ایرانی هستم! 🇮🇷\n\nامتیاز: ${getTotalScore()} از ${getMaxScore()}\n\nتو چقدر ایرانی هستی؟`;
    
    await Clipboard.setStringAsync(message);
    Alert.alert(
      'کپی شد! ✅',
      'نتیجه در کلیپ‌بورد کپی شد.',
      [
        { text: 'واتساپ', onPress: () => Linking.openURL('whatsapp://') },
        { text: 'بستن', style: 'cancel' }
      ]
    );
  };

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.homeContainer}>
          <Text style={styles.homeEmoji}>🦁☀️</Text>
          <Text style={styles.homeTitle}>چقدر ایرانی هستی؟</Text>
          <Text style={styles.homeSubtitle}>۳۵ سؤال در ۵ دسته‌بندی</Text>
          
          <View style={styles.categoriesPreview}>
            {CATEGORIES.map((cat) => (
              <View key={cat.id} style={styles.categoryPreviewItem}>
                <Text style={styles.categoryPreviewEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryPreviewName}>{cat.name}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startButtonText}>شروع کوییز</Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    );
  }

  // QUIZ SCREEN
  if (screen === 'quiz' && questions.length > 0) {
    const currentCategory = CATEGORIES[currentCategoryIndex];
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <AdPopup 
          visible={showAdPopup} 
          onClose={() => setShowAdPopup(false)}
          onDownload={() => {
            setShowAdPopup(false);
            openBalansCoach();
          }}
        />
        
	<View style={[styles.quizHeader, { backgroundColor: currentCategory.color }]}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setScreen('home')}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.categoryTitle}>
            {currentCategory.emoji} {currentCategory.name}
          </Text>
          <Text style={styles.questionCounter}>
            سؤال {currentQuestionIndex + 1} از {QUESTIONS_PER_CATEGORY}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          {CATEGORIES.map((cat, index) => (
            <View 
              key={cat.id} 
              style={[
                styles.progressDot,
                index < currentCategoryIndex && styles.progressDotComplete,
                index === currentCategoryIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <ScrollView style={styles.questionContainer} contentContainerStyle={styles.questionContent}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.answersContainer}>
            {currentQuestion.answers.map((answer, index) => {
              let buttonStyle = [styles.answerButton];
              let textStyle = [styles.answerText];

              if (showResult) {
                if (index === currentQuestion.correct) {
                  buttonStyle.push(styles.correctAnswer);
                  textStyle.push(styles.correctAnswerText);
                } else if (index === selectedAnswer) {
                  buttonStyle.push(styles.wrongAnswer);
                  textStyle.push(styles.wrongAnswerText);
                }
              } else if (selectedAnswer === index) {
                buttonStyle.push(styles.selectedAnswer);
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={buttonStyle}
                  onPress={() => handleAnswer(index)}
                  disabled={showResult}
                >
                  <Text style={textStyle}>{answer}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showResult && (
            <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < QUESTIONS_PER_CATEGORY - 1 
                  ? '→ سؤال بعدی'
                  : currentCategoryIndex < CATEGORIES.length - 1
                    ? `→ ${CATEGORIES[currentCategoryIndex + 1].name}`
                    : '🎉 نتیجه نهایی'
                }
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        
        {showSmallBanner && <SmallBanner onPress={openBalansCoach} />}
      </SafeAreaView>
    );
  }

  // RESULTS SCREEN
  if (screen === 'results') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContainer}>
	  <Text style={styles.resultsEmoji}>🦁☀️</Text>
          <Text style={styles.resultsTitle}>{getTitle()}</Text>
          <Text style={styles.resultsScore}>
            {getTotalScore()} از {getMaxScore()} ({getPercentage()}%)
          </Text>

          <View style={styles.breakdownContainer}>
            {CATEGORIES.map((cat) => (
              <View key={cat.id} style={styles.breakdownItem}>
                <Text style={styles.breakdownScore}>{score[cat.id]}/{QUESTIONS_PER_CATEGORY}</Text>
                <Text style={styles.breakdownName}>{cat.name}</Text>
                <Text style={styles.breakdownEmoji}>{cat.emoji}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={shareResult}>
            <Text style={styles.shareButtonText}>📤 اشتراک‌گذاری</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playAgainButton} onPress={startQuiz}>
            <Text style={styles.playAgainButtonText}>🔄 بازی دوباره</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={() => setScreen('home')}>
            <Text style={styles.homeButtonText}>🏠 صفحه اصلی</Text>
          </TouchableOpacity>
          
          {/* BalansCoach promo on results */}
          <TouchableOpacity style={styles.resultsBanner} onPress={openBalansCoach}>
            <Text style={styles.resultsBannerEmoji}>🥗</Text>
            <View style={styles.resultsBannerText}>
              <Text style={styles.resultsBannerTitle}>BalansCoach Pro</Text>
              <Text style={styles.resultsBannerSub}>مربی هوش مصنوعی تغذیه</Text>
            </View>
            <Text style={styles.resultsBannerCTA}>دانلود ←</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  
  // Home Screen
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  homeEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  homeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    writingDirection: 'rtl',
  },
  categoriesPreview: {
    width: '100%',
    marginBottom: 32,
  },
  categoryPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPreviewEmoji: {
    fontSize: 22,
    marginLeft: 12,
  },
  categoryPreviewName: {
    fontSize: 15,
    color: '#333',
    writingDirection: 'rtl',
  },
  startButton: {
    backgroundColor: '#00A651',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    shadowColor: '#00A651',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },

  // Quiz Screen
  quizHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    writingDirection: 'rtl',
  },
  questionCounter: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    writingDirection: 'rtl',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  progressDotComplete: {
    backgroundColor: '#00A651',
  },
  progressDotActive: {
    backgroundColor: '#ED1C24',
    width: 20,
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 32,
    writingDirection: 'rtl',
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  answerText: {
    fontSize: 17,
    color: '#333',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  selectedAnswer: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
  },
  correctAnswer: {
    borderColor: '#00A651',
    backgroundColor: '#E8F8F0',
  },
  correctAnswerText: {
    color: '#00A651',
    fontWeight: '600',
  },
  wrongAnswer: {
    borderColor: '#ED1C24',
    backgroundColor: '#FDEDEE',
  },
  wrongAnswerText: {
    color: '#ED1C24',
  },
  nextButton: {
    backgroundColor: '#00A651',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
    closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  closeButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 22,
    fontWeight: '600',
  },
  // Results Screen
  resultsScroll: {
    flex: 1,
  },
  resultsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  resultsEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  resultsScore: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    writingDirection: 'rtl',
  },
  breakdownContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownEmoji: {
    fontSize: 20,
    marginLeft: 10,
  },
  breakdownName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  breakdownScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A651',
    marginRight: 12,
  },
  shareButton: {
    width: '100%',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  playAgainButton: {
    width: '100%',
    backgroundColor: '#3498DB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  homeButton: {
    width: '100%',
    backgroundColor: '#95A5A6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // Small Banner
  smallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9DC88D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  smallBannerEmoji: {
    fontSize: 20,
  },
  smallBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  smallBannerApp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },

  // Ad Popup Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  adModal: {
    backgroundColor: '#9DC88D',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  adCloseButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
  },
  adCloseText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 20,
  },
  adEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  adTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  adDescription: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    writingDirection: 'rtl',
  },
  adFeatures: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  adFeature: {
    alignItems: 'center',
  },
  adFeatureEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  adFeatureText: {
    color: '#fff',
    fontSize: 12,
    writingDirection: 'rtl',
  },
  adButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  adButtonText: {
    color: '#9DC88D',
    fontSize: 18,
    fontWeight: '700',
  },
  adSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    writingDirection: 'rtl',
  },

  // Results Banner
  resultsBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9DC88D',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  resultsBannerEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  resultsBannerText: {
    flex: 1,
  },
  resultsBannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsBannerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    writingDirection: 'rtl',
  },
  resultsBannerCTA: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
