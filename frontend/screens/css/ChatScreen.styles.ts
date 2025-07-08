import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  content: {
    flex: 1,
  },
  
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8f4fd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 2,
  },
  headerSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    letterSpacing: 1,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },

  // MESSAGES
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#4a90e2',
    borderBottomRightRadius: 8,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#e8f4fd',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#2c3e50',
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  userMessageTime: {
    color: '#ffffff',
    textAlign: 'right',
  },
  assistantMessageTime: {
    color: '#7f8c8d',
    textAlign: 'left',
  },

  // INDICATEUR DE FRAPPE
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  typingBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8f4fd',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 2,
  },

  // ZONE DE SAISIE
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8f4fd',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafe',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8f4fd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    maxHeight: 120,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#4a90e2',
    shadowColor: '#4a90e2',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonInactive: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
