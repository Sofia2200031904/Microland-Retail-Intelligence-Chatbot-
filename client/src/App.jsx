import { useEffect, useRef, useState } from "react";
import {
  getInventorySummary,
  getProducts,
  getSalesSummary,
  getStorePerformance,
  sendChatMessage,
} from "./api/chatApi";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import ForecastCard from "./components/ForecastCard";
import KpiCards from "./components/KpiCards";
import LandingPage from "./components/LandingPage";
import ProductCatalog from "./components/ProductCatalog";
import QuickPrompts from "./components/QuickPrompts";
import StoreAnalyticsPanel from "./components/StoreAnalyticsPanel";
import StorySupportPage from "./components/StorySupportPage";
import TypingIndicator from "./components/TypingIndicator";
import { quickPrompts } from "./data/quickPrompts";
import {
  buildDashboardAlerts,
  buildDashboardForecast,
  buildDynamicQuickActions,
} from "./utils/dashboardInsights";

const projectCapabilities = [
  "Responsive web and mobile experience",
  "Text and voice input for chatbot queries",
  "Inventory, sales, and product intelligence",
  "Charts, recommendations, and service automation",
];

const retailSections = [
  "Electronics retail analytics",
  "Voice-enabled product discovery",
  "Sales performance insights",
  "Stock alerts and restock actions",
];

const initialMessages = [
  {
    id: "welcome-message",
    role: "assistant",
    text:
      "Welcome to our electronics store.\nHow can I help you today?\n\nAsk me about stock levels, sales trends, order support, or product recommendations.",
    suggestions: quickPrompts,
    insights: [
      {
        title: "Live capabilities",
        body: "This chatbot supports voice and text input, inventory answers, sales insights, charts, recommendations, and customer support automation.",
      },
    ],
  },
];

function getPageFromHash(hash) {
  if (hash === "#all") {
    return "all";
  }

  if (hash === "#details") {
    return "details";
  }

  if (hash === "#insights") {
    return "insights";
  }

  if (hash === "#collections") {
    return "collections";
  }

  if (hash === "#home") {
    return "landing";
  }

  return "landing";
}

function ChatLauncherIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 18.5H5.5C4.94772 18.5 4.5 18.0523 4.5 17.5V7.5C4.5 6.39543 5.39543 5.5 6.5 5.5H17.5C18.6046 5.5 19.5 6.39543 19.5 7.5V14.5C19.5 15.6046 18.6046 16.5 17.5 16.5H11L7 19.5V18.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.5H16M8 13.5H13"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScrollTopIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 19V7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M6.5 12.5L12 7L17.5 12.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromHash(window.location.hash)
  );
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(false);
  const [inventorySummary, setInventorySummary] = useState({});
  const [salesSummary, setSalesSummary] = useState({});
  const [storePerformance, setStorePerformance] = useState({
    chart: null,
    summary: null,
  });
  const [products, setProducts] = useState([]);
  const [selectedCollectionSku, setSelectedCollectionSku] = useState(null);
  const [conversationContext, setConversationContext] = useState({});
  const listRef = useRef(null);

  useEffect(() => {
    const syncPageWithHash = () => {
      setCurrentPage(getPageFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", syncPageWithHash);
    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [inventoryData, salesData, productData, storePerformanceData] = await Promise.all([
          getInventorySummary(),
          getSalesSummary(),
          getProducts(),
          getStorePerformance(),
        ]);

        const nextInventorySummary = inventoryData.summary || {};
        const nextSalesSummary = salesData.summary || {};
        const nextProducts = productData.items || [];
        const dynamicPrompts = buildDynamicQuickActions(
          nextProducts,
          nextSalesSummary
        );

        setInventorySummary(nextInventorySummary);
        setSalesSummary(nextSalesSummary);
        setProducts(nextProducts);
        setStorePerformance(storePerformanceData);
        setMessages((current) =>
          current.map((message, index) =>
            index === 0 ? { ...message, suggestions: dynamicPrompts } : message
          )
        );
      } catch (error) {
        console.error("Dashboard load failed", error);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const container = listRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  const openChatWidget = (focusComposer = false) => {
    setIsWidgetOpen(true);

    if (focusComposer) {
      window.setTimeout(() => {
        const composer = document.querySelector("textarea");
        composer?.focus();
      }, 250);
    }
  };

  const toggleWidgetExpansion = () => {
    setIsWidgetExpanded((current) => !current);
  };

  const navigateToPage = (page) => {
    const nextHash =
      page === "all"
        ? "#all"
        : page === "details"
        ? "#details"
        : page === "insights"
          ? "#insights"
          : page === "collections"
            ? "#collections"
            : "#landing";
    window.history.pushState(null, "", nextHash);
    setCurrentPage(page === "home" ? "landing" : page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductInsightOpen = (productName) => {
    setIsWidgetExpanded(true);
    handleSendMessage(`Tell me about the ${productName}`);
  };

  const handleSendMessage = async (text) => {
    const cleanedText = text.trim();
    if (!cleanedText) {
      return;
    }

    setIsWidgetOpen(true);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: cleanedText,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(cleanedText, conversationContext);
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: data.reply,
        chart: data.chart,
        productDetails: data.productDetails,
        recommendations: data.recommendations,
        suggestions: data.followUpPrompts,
        insights: data.insights,
        actions: data.actions,
        prediction: data.prediction,
        alert: data.alert,
      };

      setConversationContext(data.contextMemory || {});
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error("Chat request failed", error);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text:
            "I could not reach the backend right now. Make sure the Express server is running on port 5000.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardAlerts = buildDashboardAlerts(products, salesSummary);
  const forecastCard = buildDashboardForecast(products);
  const dynamicQuickActions = buildDynamicQuickActions(products, salesSummary);
  const alertToneClasses = {
    critical: "border-[#ffd0c7] bg-[#fff5f3] text-[#8a2b1f]",
    warning: "border-[#ffd597] bg-[#fff7e8] text-[#8a5a00]",
    positive: "border-[#bfe4c9] bg-[#f2fcf5] text-[#1c6b35]",
  };
  const featuredProduct = [...products]
    .filter((item) => item.category === "Electronics")
    .sort((a, b) => b.rating - a.rating || b.soldUnits - a.soldUnits)[0];
  const topNavigation = [
    { label: "All", page: "all" },
    { label: "Home", page: "landing" },
    { label: "Insights", page: "insights" },
    { label: "Collections", page: "collections" },
    { label: "Voice Search", action: () => openChatWidget(true) },
    { label: "Support", page: "details" },
  ];

  const handleTopNavigation = ({ action, page }) => {
    const needsPageChange = Boolean(page) && currentPage !== page;

    if (needsPageChange) {
      navigateToPage(page);
    } else if (page === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (action) {
      if (needsPageChange) {
        window.setTimeout(() => action(), 80);
      } else {
        action();
      }
    }
  };

  const openDashboardFromLanding = () => {
    navigateToPage("all");
  };

  const openSmartAlertsFromLanding = () => {
    navigateToPage("insights");
    window.setTimeout(() => {
      handleSendMessage("Which electronics need urgent restocking?");
    }, 80);
  };

  const openFeaturedProductFromLanding = () => {
    if (!featuredProduct) {
      navigateToPage("collections");
      return;
    }

    setSelectedCollectionSku(featuredProduct.sku);
    navigateToPage("collections");
  };

  return (
    <main className="min-h-[100dvh] bg-[#eaeded] text-[#131921]">
      <div className="bg-[#232f3e] shadow-soft">
        <div className="app-shell py-4 sm:py-5">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => navigateToPage("landing")}
                className="font-display text-left text-[clamp(2rem,6vw,3.6rem)] font-semibold tracking-[0.01em] text-white transition hover:text-[#ffcc80]"
              >
                Electronics Retail Platform
              </button>
              <p className="mt-2 max-w-2xl text-sm text-[#d7e5f2] sm:text-[15px]">
                AI-powered insights for inventory, sales, recommendations, and
                customer support.
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center justify-center gap-2 text-sm text-white sm:justify-start lg:w-auto lg:justify-end">
              {topNavigation.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleTopNavigation(item)}
                  aria-label={item.label}
                  className="rounded-full border border-white/12 bg-white/5 px-4 py-2 transition hover:border-[#ff9900] hover:bg-white/10"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>
        </div>
      </div>

      <div
        className={`app-shell page-viewport flex flex-col ${
          currentPage === "all" ||
          currentPage === "insights" ||
          currentPage === "collections"
            ? "gap-8 py-4 sm:py-6 lg:py-8"
            : currentPage === "details"
              ? "py-3 sm:py-5 lg:py-6"
              : "py-3 sm:py-5"
        }`}
      >
        {currentPage === "landing" ? (
          <LandingPage
            projectCapabilities={projectCapabilities}
            retailSections={retailSections}
            featuredProduct={featuredProduct}
            onEnterCockpit={openDashboardFromLanding}
            onViewSmartAlerts={openSmartAlertsFromLanding}
            onOpenProductInsight={openFeaturedProductFromLanding}
          />
        ) : currentPage === "all" ||
          currentPage === "insights" ||
          currentPage === "collections" ? (
          <>
        {currentPage === "all" ? (
          <LandingPage
            projectCapabilities={projectCapabilities}
            retailSections={retailSections}
            featuredProduct={featuredProduct}
            onEnterCockpit={openDashboardFromLanding}
            onViewSmartAlerts={openSmartAlertsFromLanding}
            onOpenProductInsight={openFeaturedProductFromLanding}
            isStacked
          />
        ) : null}

        {currentPage === "insights" || currentPage === "all" ? (
        <section className="relative">
          <div className="relative w-full rounded-[34px] border border-[#d6e6f2] bg-[#eff5f9] p-2 shadow-stage">
            <div className="overflow-hidden rounded-[28px] border border-[#d6e6f2] bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_36%,#eef6ff_100%)] text-[#131921]">
              <div className="border-b border-[#d9e7ff] px-5 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                    Insights workspace
                  </p>
                  <h2 className="mt-3 text-[clamp(2.4rem,4vw,4.4rem)] font-semibold leading-[0.98] text-[#1a2942]">
                    Store analytics stays centered, and the insight cards line up underneath.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#5a6b85] sm:text-[15px]">
                    The profit and loss panel now sits in the middle of the page,
                    while the assistant, alerts, forecast, KPIs, and actions are
                    arranged below in balanced rows and columns.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-8">
                <div className="mx-auto max-w-5xl">
                  <StoreAnalyticsPanel storePerformance={storePerformance} />
                </div>

                <div className="mx-auto mt-8 grid max-w-6xl gap-4 lg:grid-cols-2">
                  <div className="h-full rounded-[28px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#007185]">
                      Retail intelligence
                    </p>
                    <h3 className="mt-3 text-[1.8rem] font-semibold leading-tight text-[#131921]">
                      AI dashboard for an electronics retail store
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
                      Inventory, sales, products, voice, charts, recommendations,
                      and customer service automation now stay visible in one clear
                      insights view instead of stretching into a narrow sidebar.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {projectCapabilities.map((capability) => (
                        <div
                          key={capability}
                          className="rounded-[22px] border border-[#dce9ff] bg-[#f8fbff] p-4 text-sm leading-6 text-[#53627c]"
                        >
                          {capability}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-full rounded-[28px] border border-[#d7e7ff] bg-[linear-gradient(180deg,#f9fcff_0%,#eef6ff_100%)] p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                          Floating AI assistant
                        </p>
                        <h3 className="mt-3 text-[1.8rem] font-semibold leading-tight text-[#1a2942]">
                          Open the assistant from the bottom-right launcher anytime.
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => openChatWidget(true)}
                        className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#131921] text-white shadow-[0_24px_50px_rgba(9,24,52,0.22)] transition hover:scale-[1.02]"
                        aria-label="Open chatbot"
                      >
                        <ChatLauncherIcon className="h-8 w-8" />
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#53627c]">
                      Customers can browse the website normally, then launch the
                      assistant for inventory checks, product recommendations,
                      charts, and support questions without leaving the page.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleSendMessage("Show me current inventory status")
                        }
                        className="rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffad33]"
                      >
                        Ask inventory
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSendMessage("How can a customer track an order?")
                        }
                        className="rounded-full border border-[#2b7cff] bg-white px-5 py-3 text-sm font-semibold text-[#216bff] transition hover:bg-[#eef5ff]"
                      >
                        Ask support
                      </button>
                    </div>
                  </div>

                  {dashboardAlerts.map((alert) => (
                    <div
                      key={`${alert.label}-${alert.title}`}
                      className={`flex h-full min-h-[220px] flex-col rounded-[28px] border p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)] ${
                        alertToneClasses[alert.tone] || alertToneClasses.warning
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                        {alert.label}
                      </p>
                      <h3 className="mt-3 text-[1.55rem] font-semibold leading-tight">
                        {alert.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 opacity-90">{alert.body}</p>
                      {alert.actionPrompt ? (
                        <button
                          type="button"
                          onClick={() => handleSendMessage(alert.actionPrompt)}
                          className="mt-auto rounded-full bg-[#232f3e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#131921]"
                        >
                          {alert.actionPrompt}
                        </button>
                      ) : null}
                    </div>
                  ))}

                  {forecastCard ? (
                    <ForecastCard
                      forecast={forecastCard}
                      onAction={handleSendMessage}
                      className="h-full"
                    />
                  ) : (
                    <div className="h-full rounded-[28px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                        Predictive insight
                      </p>
                      <h3 className="mt-3 text-[1.8rem] font-semibold leading-tight text-[#131921]">
                        Forecast data will appear here once product trends are available.
                      </h3>
                    </div>
                  )}
                </div>

                <div className="mx-auto mt-8 max-w-6xl">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#216bff]">
                        KPI board
                      </p>
                      <h3 className="mt-2 text-[1.8rem] font-semibold leading-tight text-[#1a2942]">
                        Equal metric cards across the page.
                      </h3>
                    </div>
                    <div className="rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#007185]">
                      Live numbers
                    </div>
                  </div>
                  <KpiCards
                    inventorySummary={inventorySummary}
                    salesSummary={salesSummary}
                  />
                </div>

                <div className="mx-auto mt-8 max-w-6xl rounded-[30px] border border-[#d7e7ff] bg-white p-5 shadow-[0_18px_42px_rgba(26,41,66,0.08)] sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#007185]">
                        Smart quick actions
                      </p>
                      <h3 className="mt-2 text-[1.8rem] font-semibold leading-tight text-[#131921]">
                        Actions stay below the analytics cards in an even grid.
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#5f6b7a]">
                        The prompts now sit underneath the dashboard in balanced
                        rows instead of forming one long narrow stack.
                      </p>
                    </div>
                    <div className="rounded-full border border-[#d7e7ff] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#216bff]">
                      {Math.min(dynamicQuickActions.length, 4)} actions
                    </div>
                  </div>
                  <div className="mt-5">
                    <QuickPrompts
                      prompts={dynamicQuickActions.slice(0, 4)}
                      onSelect={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {currentPage === "collections" || currentPage === "all" ? (
        <section className="mt-0">
          <ProductCatalog
            products={products}
            preselectedSku={selectedCollectionSku}
            onSelectProduct={(product) => setSelectedCollectionSku(product.sku)}
          />
        </section>
        ) : null}

        {currentPage === "all" ? (
          <StorySupportPage
            retailSections={retailSections}
            onBack={() => navigateToPage("landing")}
            onTrackOrder={() => handleSendMessage("How can a customer track an order?")}
            onReturnPolicy={() => handleSendMessage("What is the return policy?")}
            showBackButton={false}
            isStacked
          />
        ) : null}
          </>
        ) : (
          <StorySupportPage
            retailSections={retailSections}
            onBack={() => navigateToPage("landing")}
            onTrackOrder={() => handleSendMessage("How can a customer track an order?")}
            onReturnPolicy={() => handleSendMessage("What is the return policy?")}
            showBackButton
          />
        )}
      </div>

      <footer className="border-t border-[#d6e2ec] bg-[#f7fafc] py-4 text-center text-sm text-[#5f6b7a]">
        @Sofia copyright | All rights reserved
      </footer>

      <div
        className={`fixed z-50 flex flex-col gap-3 ${
          isWidgetExpanded
            ? "inset-0 items-stretch justify-stretch sm:inset-3 lg:inset-5"
            : "bottom-4 right-4 items-end justify-end sm:bottom-6 sm:right-6"
        }`}
      >
        {currentPage === "all" && !isWidgetExpanded ? (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#161616] text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:translate-y-[-2px] hover:bg-[#202020]"
            aria-label="Scroll to top"
          >
            <ScrollTopIcon className="h-6 w-6" />
          </button>
        ) : null}

        {isWidgetOpen ? (
          <div
            className={`flex flex-col overflow-hidden border border-[#cfe1ff] bg-white text-[#1a2942] shadow-[0_30px_80px_rgba(9,24,52,0.28)] ${
              isWidgetExpanded
                ? "h-full w-full rounded-[28px]"
                : "h-[min(620px,calc(100dvh-108px))] w-[calc(100vw-24px)] rounded-[28px] sm:w-[390px] sm:rounded-[34px]"
            }`}
          >
            <ChatHeader
              onExpand={toggleWidgetExpansion}
              isExpanded={isWidgetExpanded}
              onClose={() => {
                setIsWidgetOpen(false);
                setIsWidgetExpanded(false);
              }}
            />

            <div
              ref={listRef}
              className="scrollbar-thin flex flex-1 flex-col gap-4 overflow-y-auto bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_42%,#eef6ff_100%)] p-4"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onAction={handleSendMessage}
                />
              ))}

              {isLoading ? <TypingIndicator /> : null}
            </div>

            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openChatWidget(true)}
            className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#131921] text-white shadow-[0_24px_50px_rgba(9,24,52,0.28)] transition hover:translate-y-[-2px] hover:bg-[#232f3e]"
            aria-label="Open retail chatbot"
          >
            <ChatLauncherIcon className="h-9 w-9" />
          </button>
        )}
      </div>
    </main>
  );
}
