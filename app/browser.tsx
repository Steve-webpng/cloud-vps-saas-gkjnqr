
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';
import { useP2PStore } from '@/stores/p2pStore';

export default function BrowserScreen() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const { isConnectedAsReceiver, activeReceiverConnection } = useP2PStore();

  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is connected
  if (!isConnectedAsReceiver) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Browser</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notConnectedContainer}>
          <IconSymbol name="wifi.slash" size={64} color={colors.textSecondary} />
          <Text style={styles.notConnectedTitle}>Not Connected</Text>
          <Text style={styles.notConnectedSubtitle}>
            Please connect to a network node to access the browser
          </Text>
          <Pressable
            style={styles.connectButton}
            onPress={() => router.push('/(tabs)/p2p')}
          >
            <Text style={styles.connectButtonText}>Go to P2P Network</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleNavigate = () => {
    let finalUrl = url.trim();
    
    // Add https:// if no protocol specified
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setCurrentUrl(finalUrl);
    setUrl(finalUrl);
  };

  const handleGoBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
    setUrl(navState.url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Browser</Text>
        <View style={styles.connectionBadge}>
          <View style={styles.connectionDot} />
          <Text style={styles.connectionText}>Connected</Text>
        </View>
      </View>

      {/* Connection Info Bar */}
      {activeReceiverConnection && (
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <IconSymbol name="wifi" size={14} color={colors.success} />
            <Text style={styles.infoText}>{activeReceiverConnection.peerName}</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="chart.bar.fill" size={14} color={colors.primary} />
            <Text style={styles.infoText}>
              {activeReceiverConnection.bandwidth.total.toFixed(2)} GB
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol name="dollarsign.circle.fill" size={14} color={colors.warning} />
            <Text style={styles.infoText}>
              ${(activeReceiverConnection.cost || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* URL Bar */}
      <View style={styles.urlBar}>
        <View style={styles.urlInputContainer}>
          <IconSymbol name="lock.fill" size={16} color={colors.success} />
          <TextInput
            style={styles.urlInput}
            value={url}
            onChangeText={setUrl}
            onSubmitEditing={handleNavigate}
            placeholder="Enter URL or search..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
          />
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
        <Pressable style={styles.goButton} onPress={handleNavigate}>
          <IconSymbol name="arrow.right.circle.fill" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.controlButton, !canGoBack && styles.controlButtonDisabled]}
          onPress={handleGoBack}
          disabled={!canGoBack}
        >
          <IconSymbol
            name="chevron.left"
            size={20}
            color={canGoBack ? colors.text : colors.textSecondary}
          />
        </Pressable>
        <Pressable
          style={[styles.controlButton, !canGoForward && styles.controlButtonDisabled]}
          onPress={handleGoForward}
          disabled={!canGoForward}
        >
          <IconSymbol
            name="chevron.right"
            size={20}
            color={canGoForward ? colors.text : colors.textSecondary}
          />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={handleRefresh}>
          <IconSymbol name="arrow.clockwise" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.spacer} />
        <Pressable
          style={styles.controlButton}
          onPress={() => {
            Alert.alert(
              'Browser Info',
              `You are browsing through a secure P2P connection.\n\nConnected to: ${activeReceiverConnection?.peerName}\nData used: ${activeReceiverConnection?.bandwidth.total.toFixed(2)} GB\nCurrent cost: $${(activeReceiverConnection?.cost || 0).toFixed(2)}`
            );
          }}
        >
          <IconSymbol name="info.circle" size={20} color={colors.text} />
        </Pressable>
      </View>

      {/* WebView */}
      {Platform.OS === 'web' ? (
        <View style={styles.webNotSupported}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.warning} />
          <Text style={styles.webNotSupportedTitle}>Web Platform</Text>
          <Text style={styles.webNotSupportedText}>
            The in-app browser is not available on web. Please use your regular browser.
          </Text>
          <Pressable
            style={styles.openExternalButton}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.open(currentUrl, '_blank');
              }
            }}
          >
            <Text style={styles.openExternalButtonText}>Open in New Tab</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        />
      )}

      {/* Quick Access Bar */}
      <View style={styles.quickAccess}>
        <Pressable
          style={styles.quickAccessButton}
          onPress={() => {
            setUrl('https://www.google.com');
            setCurrentUrl('https://www.google.com');
          }}
        >
          <Text style={styles.quickAccessText}>Google</Text>
        </Pressable>
        <Pressable
          style={styles.quickAccessButton}
          onPress={() => {
            setUrl('https://www.youtube.com');
            setCurrentUrl('https://www.youtube.com');
          }}
        >
          <Text style={styles.quickAccessText}>YouTube</Text>
        </Pressable>
        <Pressable
          style={styles.quickAccessButton}
          onPress={() => {
            setUrl('https://www.wikipedia.org');
            setCurrentUrl('https://www.wikipedia.org');
          }}
        >
          <Text style={styles.quickAccessText}>Wikipedia</Text>
        </Pressable>
        <Pressable
          style={styles.quickAccessButton}
          onPress={() => {
            setUrl('https://www.github.com');
            setCurrentUrl('https://www.github.com');
          }}
        >
          <Text style={styles.quickAccessText}>GitHub</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  urlInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  urlInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  goButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  spacer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickAccessButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  notConnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notConnectedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  notConnectedSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  webNotSupported: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  webNotSupportedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  webNotSupportedText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  openExternalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  openExternalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
