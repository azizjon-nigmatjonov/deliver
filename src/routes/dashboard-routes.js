import FullScreenLoader from "components/Skeleton";
import Loadable from "react-loadable";

const OperatorCalls = Loadable({
  loader: () => import("views/operatorCalls/index"),
  loading: FullScreenLoader,
});

const Clients = Loadable({
  loader: () => import("views/clients"),
  loading: FullScreenLoader,
});
const ClientsFormPage = Loadable({
  loader: () => import("views/clients/ClientsFormPage/index"),
  loading: FullScreenLoader,
});
const Account = Loadable({
  loader: () => import("views/account"),
  loading: FullScreenLoader,
});
const Orders = Loadable({
  loader: () => import("views/orders"),
  loading: FullScreenLoader,
});
const OrderForm = Loadable({
  loader: () => import("views/orders/form"),
  loading: FullScreenLoader,
});
const RepeatOrderForm = Loadable({
  loader: () => import("views/orders/form"),
  loading: FullScreenLoader,
});

const SendInvoice = Loadable({
  loader: () => import("views/orders/SendInvoice"),
  loading: FullScreenLoader,
});

const TrackCourier = Loadable({
  loader: () => import("views/orders/TrackCourier/index.jsx"),
  loading: FullScreenLoader,
});
const AddBranchUsers = Loadable({
  loader: () => import("views/settings/company/tabs/Branches/BranchUsers/index"),
  loading: FullScreenLoader,
});

const Kitchen = Loadable({
  loader: () => import("views/kitchen"),
  loading: FullScreenLoader,
});

const KitchenHistoryOrders = Loadable({
  loader: () => import("views/kitchen/KitchenHistoryOrders"),
  loading: FullScreenLoader,
});

const KitchenCouriers = Loadable({
  loader: () => import("views/kitchen/KitchenCouriers"),
  loading: FullScreenLoader,
});

const KitchenFinance = Loadable({
  loader: () => import("views/kitchen/KitchenFinance"),
  loading: FullScreenLoader,
});

const Stocks = Loadable({
  loader: () => import("views/marketing/stocks"),
  loading: FullScreenLoader,
});
const StockCreate = Loadable({
  loader: () => import("views/marketing/stocks/form"),
  loading: FullScreenLoader,
});
const SmsSending = Loadable({
  loader: () => import("views/marketing/SmsSending"),
  loading: FullScreenLoader,
});

const NotificationtoApps = Loadable({
  loader: () => import("views/marketing/NotificationtoApps/index"),
  loading: FullScreenLoader,
});

const CreateNotificationtoApps = Loadable({
  loader: () => import("views/marketing/NotificationtoApps/Create"),
  loading: FullScreenLoader,
});

const Banners = Loadable({
  loader: () => import("views/marketing/banners/index"),
  loading: FullScreenLoader,
});
const CreateBanner = Loadable({
  loader: () => import("views/marketing/banners/Create"),
  loading: FullScreenLoader,
});

const PopUp = Loadable({
  loader: () => import("views/marketing/pop-up/index"),
  loading: FullScreenLoader,
});

const CreatePopUp = Loadable({
  loader: () => import("views/marketing/pop-up/Create"),
  loading: FullScreenLoader,
});
const Courier = Loadable({
  loader: () => import("views/personal/courier"),
  loading: FullScreenLoader,
});
const CourierCreate = Loadable({
  loader: () => import("views/personal/courier/form"),
  loading: FullScreenLoader,
});
const Operator = Loadable({
  loader: () => import("views/personal/operator"),
  loading: FullScreenLoader,
});
const OperatorCreate = Loadable({
  loader: () => import("views/personal/operator/Create"),
  loading: FullScreenLoader,
});
const ReportsCourier = Loadable({
  loader: () => import("views/reports/courier/index"),
  loading: FullScreenLoader,
});
const OperatorReports = Loadable({
  loader: () => import("views/reports/operatorReport/index"),
  loading: FullScreenLoader,
});
const OrderReports = Loadable({
  loader: () => import("views/reports/orderReport/index"),
  loading: FullScreenLoader,
});
const Forecasting = Loadable({
  loader: () => import("views/reports/forecasting-delivery-time-reports/index"),
  loading: FullScreenLoader,
});
const DeliveryTimeReports = Loadable({
  loader: () => import("views/reports/delivery-time-reports/index"),
  loading: FullScreenLoader,
});
const BranchReports = Loadable({
  loader: () => import("views/reports/branchReport/index"),
  loading: FullScreenLoader,
});
const ProductReports = Loadable({
  loader: () => import("views/reports/productReport/index"),
  loading: FullScreenLoader,
});
const CommentReport = Loadable({
  loader: () => import("views/reports/comment-report/index"),
  loading: FullScreenLoader,
});
const AllAggregator = Loadable({
  loader: () => import("views/reports/all-aggregator"),
  loading: FullScreenLoader,
});
const OrderStatusReport = Loadable({
  loader: () => import("views/reports/order-status-report"),
  loading: FullScreenLoader,
});

const DashboardReport = Loadable({
  loader: () => import("views/reports/dashboard-report"),
  loading: FullScreenLoader,
});

const CourierInformation = Loadable({
  loader: () => import("views/reports/courier/AllInformation"),
  loading: FullScreenLoader,
});

const AllReports = Loadable({
  loader: () => import("views/reports/allReport/index"),
  loading: FullScreenLoader,
});

const ExternalDeliveryReport = Loadable({
  loader: () => import("views/reports/externalDelivery-report/index"),
  loading: FullScreenLoader,
});

const CustomerReport = Loadable({
  loader: () => import("views/reports/customer-report/index"),
  loading: FullScreenLoader,
});

const DailyReport = Loadable({
  loader: () => import("views/reports/daily-reports/index"),
  loading: FullScreenLoader,
});

const CourierType = Loadable({
  loader: () => import("views/personal/courierType"),
  loading: FullScreenLoader,
});
const CourierTypeCreate = Loadable({
  loader: () => import("views/personal/courierType/form"),
  loading: FullScreenLoader,
});
const CourierFare = Loadable({
  loader: () => import("views/personal/courierFare"),
  loading: FullScreenLoader,
});
const CourierFareCreate = Loadable({
  loader: () => import("views/personal/courierFare/Create"),
  loading: FullScreenLoader,
});
const CourierAttendance = Loadable({
  loader: () => import("views/personal/courierAttendance"),
  loading: FullScreenLoader,
});
const BonusPenaltyComponent = Loadable({
  loader: () => import("views/personal/BonusPenalty"),
  loading: FullScreenLoader,
});
const BonusPenaltyCreate = Loadable({
  loader: () => import("views/personal/BonusPenalty/form/"),
  loading: FullScreenLoader,
});
const Fares = Loadable({
  loader: () => import("views/settings/rates"),
  loading: FullScreenLoader,
});
const TariffCreate = Loadable({
  loader: () => import("views/settings/rates/form"),
  loading: FullScreenLoader,
});

const Aggregator = Loadable({
  loader: () => import("views/settings/aggregator"),
  loading: FullScreenLoader,
});

const AggregatorCreate = Loadable({
  loader: () => import("views/settings/aggregator/Form"),
  loading: FullScreenLoader,
});

const Integrations = Loadable({
  loader: () => import("views/settings/integrations"),
  loading: FullScreenLoader,
});

const IntegrationsYandex = Loadable({
  loader: () => import("views/settings/integrations/yandex"),
  loading: FullScreenLoader,
});

const IikoEdit = Loadable({
  loader: () => import("views/settings/integrations/iiko"),
  loading: FullScreenLoader,
});
const JowiEdit = Loadable({
  loader: () => import("views/settings/integrations/jowi"),
  loading: FullScreenLoader,
});
const Payme = Loadable({
  loader: () => import("views/settings/integrations/payme"),
  loading: FullScreenLoader,
});
const PaymeCreate = Loadable({
  loader: () => import("views/settings/integrations/payme/PaymeCreate"),
  loading: FullScreenLoader,
});
const Click = Loadable({
  loader: () => import("views/settings/integrations/click"),
  loading: FullScreenLoader,
});
const Apelsin = Loadable({
  loader: () => import("views/settings/integrations/apelsin/Apelsin"),
  loading: FullScreenLoader,
});
const ApelsinCreate = Loadable({
  loader: () => import("views/settings/integrations/apelsin/ApelsinCreate"),
  loading: FullScreenLoader,
});
const ClickCreate = Loadable({
  loader: () => import("views/settings/integrations/click/ClickCreate"),
  loading: FullScreenLoader,
});

const RKeeper = Loadable({
  loader: () => import("views/settings/integrations/rkeeper"),
  loading: FullScreenLoader,
});

const Sms = Loadable({
  loader: () => import("views/settings/integrations/sms"),
  loading: FullScreenLoader,
});

const BranchCreate = Loadable({
  loader: () => import("views/settings/integrations/iiko/BranchCreate"),
  loading: FullScreenLoader,
});
const MenuCreate = Loadable({
  loader: () => import("views/settings/integrations/iiko/MenuCreate"),
  loading: FullScreenLoader,
});
const MenuCreateCombo = Loadable({
  loader: () => import("views/settings/integrations/iiko/MenuCrateCombo"),
  loading: FullScreenLoader,
});

const MenuCreateRkeeper = Loadable({
  loader: () => import("views/settings/integrations/rkeeper/MenuCreate"),
  loading: FullScreenLoader,
});

const MenuCreateComboRkeeper = Loadable({
  loader: () => import("views/settings/integrations/rkeeper/MenuCreateCombo"),
  loading: FullScreenLoader,
});

const RkeeperBranchCreate = Loadable({
  loader: () => import("views/settings/integrations/rkeeper/BranchCreate"),
  loading: FullScreenLoader,
});

const TerminalCreate = Loadable({
  loader: () => import("views/settings/integrations/iiko/TerminalCreate"),
  loading: FullScreenLoader,
});
const JowiBranchCreate = Loadable({
  loader: () => import("views/settings/integrations/jowi/JowiBranchCreate"),
  loading: FullScreenLoader,
});
const JowiAddProduct = Loadable({
  loader: () => import("views/settings/integrations/jowi/JowiAddProduct"),
  loading: FullScreenLoader,
});

const IntegrationsCreate = Loadable({
  loader: () => import("views/settings/integrations/Form"),
  loading: FullScreenLoader,
});

const UserRoles = Loadable({
  loader: () => import("views/settings/user-roles"),
  loading: FullScreenLoader,
});

const UserRolesCreate = Loadable({
  loader: () => import("views/settings/user-roles/UserRolesFormPage"),
  loading: FullScreenLoader,
});

const Company = Loadable({
  loader: () => import("views/settings/company"),
  loading: FullScreenLoader,
});

const CompanyBranch = Loadable({
  loader: () => import("views/settings/company/tabs/Branches/Branch"),
  loading: FullScreenLoader,
});

const CreateRegion = Loadable({
  loader: () => import("views/settings/company/tabs/CreateRegion"),
  loading: FullScreenLoader,
});

const CreateGeozone = Loadable({
  loader: () => import("views/settings/company/tabs/Geozone/GeozoneForm"),
  loading: FullScreenLoader,
});

const CreateFreeGeozone = Loadable({
  loader: () =>
    import("views/settings/company/tabs/FreeGeozone/FreeGeozoneForm"),
  loading: FullScreenLoader,
});

const CompanyBranchCashiers = Loadable({
  loader: () => import("views/settings/company/tabs/Branches/Branch/tabs/Personnel/Cashiers"),
  loading: FullScreenLoader,
});

// const CompanyBranchCouriers = Loadable({
//   loader: () => import("views/settings/company/Branch/couriers"),
//   loading: FullScreenLoader,
// });

const SettingsMenu = Loadable({
  loader: () => import("views/catalog/Menu"),
  loading: FullScreenLoader,
});
const SettingsCreateMenu = Loadable({
  loader: () => import("views/catalog/Menu/Create/index"),
  loading: FullScreenLoader,
});
const SettingsEditMenu = Loadable({
  loader: () => import("views/catalog/Menu/Edit/index"),
  loading: FullScreenLoader,
});
const SettingsCatalogGoods = Loadable({
  loader: () => import("views/catalog/Goods"),
  loading: FullScreenLoader,
});

const SettingsCatalogGoodsCreate = Loadable({
  loader: () => import("views/catalog/Goods/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogCategory = Loadable({
  loader: () => import("views/catalog/Category"),
  loading: FullScreenLoader,
});

const SettingsCatalogCategoryProduct = Loadable({
  loader: () => import("views/catalog/Category/CategoryCreate"),
  loading: FullScreenLoader,
});

const SettingsCatalogAttributes = Loadable({
  loader: () => import("views/catalog/Attributes"),
  loading: FullScreenLoader,
});

const SettingsCatalogAttributesCreate = Loadable({
  loader: () => import("views/catalog/Attributes/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogUnits = Loadable({
  loader: () => import("views/catalog/Units"),
  loading: FullScreenLoader,
});

const SettingsCatalogUnitsCreate = Loadable({
  loader: () => import("views/catalog/Units/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogTags = Loadable({
  loader: () => import("views/catalog/Tags"),
  loading: FullScreenLoader,
});

const SettingsCatalogTagsCreate = Loadable({
  loader: () => import("views/catalog/Tags/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogABCXYZ = Loadable({
  loader: () => import("views/catalog/Abcxyz"),
  loading: FullScreenLoader,
});

const ContentReviews = Loadable({
  loader: () => import("views/settings/content/reviews"),
  loading: FullScreenLoader,
});

const ContentReviewsCreate = Loadable({
  loader: () => import("views/settings/content/reviews/Create"),
  loading: FullScreenLoader,
});

const ContentCancels = Loadable({
  loader: () => import("views/settings/content/cancel-reasons"),
  loading: FullScreenLoader,
});

const ContentCancelsCreate = Loadable({
  loader: () => import("views/settings/content/cancel-reasons/Create"),
  loading: FullScreenLoader,
});

const ContentCompletions = Loadable({
  loader: () => import("views/settings/content/completion-reasons"),
  loading: FullScreenLoader,
});

const ContentCompletionsCreate = Loadable({
  loader: () => import("views/settings/content/completion-reasons/Create"),
  loading: FullScreenLoader,
});

const ContentTelegramPost = Loadable({
  loader: () => import("views/marketing/telegram-post/index"),
  loading: FullScreenLoader,
});
const CreateTelegramPost = Loadable({
  loader: () => import("views/marketing/telegram-post/Create"),
  loading: FullScreenLoader,
});
const BotSettings = Loadable({
  loader: () => import("views/settings/bot-settings"),
  loading: FullScreenLoader,
});
const Balance = Loadable({
  loader: () => import("views/settings/balance/tabs/index"),
  loading: FullScreenLoader,
});
const IikoCourierConnect = Loadable({
  loader: () =>
    import("views/settings/integrations/iiko/tabs/Couriers/CourierConnect"),
  loading: FullScreenLoader,
});
const SettingsCatalogBrands = Loadable({
  loader: () => import("views/catalog/Brands"),
  loading: FullScreenLoader,
});
const SettingsCatalogBrandsCreate = Loadable({
  loader: () => import("views/catalog/Brands/Create"),
  loading: FullScreenLoader,
});
const Notifications = Loadable({
  loader: () => import("views/notifications/index"),
  loading: FullScreenLoader,
});
const OrderStats = Loadable({
  loader: () => import("views/dashboard/OrderStats"),
  loading: FullScreenLoader,
});
const ClientsStatistics = Loadable({
  loader: () => import("views/dashboard/statistics/CustomerStats"),
  loading: FullScreenLoader,
});
const ProductsStatistics = Loadable({
  loader: () => import("views/dashboard/statistics/ABCStats"),
  loading: FullScreenLoader,
});
const EmployeesStatistics = Loadable({
  loader: () => import("views/dashboard/statistics/TopStats"),
  loading: FullScreenLoader,
});
const Poster = Loadable({
  loader: () => import("views/settings/integrations/poster"),
  loading: FullScreenLoader,
});
const PosterCreate = Loadable({
  loader: () => import("views/settings/integrations/poster/BranchCreate"),
  loading: FullScreenLoader,
});
const PosterProductCreate = Loadable({
  loader: () => import("views/settings/integrations/poster/ProductCreate"),
  loading: FullScreenLoader,
});
const Discounts = Loadable({
  loader: () => import("views/settings/discounts"),
  loading: FullScreenLoader,
});
const DiscountsFormPage = Loadable({
  loader: () => import("views/settings/discounts/discountsFormPage"),
  loading: FullScreenLoader,
});
const GPTReport = Loadable({
  loader: () => import("views/reports/GPTReport"),
  loading: FullScreenLoader,
});
const ContentSettings = Loadable({
  loader: () => import("views/settings/content-setting/index"),
  loading: FullScreenLoader,
});
const SMSTemplate = Loadable({
  loader: () => import("views/settings/SMSTemplate"),
  loading: FullScreenLoader,
});
const News = Loadable({
  loader: () => import("views/marketing/News"),
  loading: FullScreenLoader,
});
const NewsFromPage = Loadable({
  loader: () => import("views/marketing/News/NewsFromPage"),
  loading: FullScreenLoader,
});
const Vacancies = Loadable({
  loader: () => import("views/marketing/Vacancies"),
  loading: FullScreenLoader,
});
const VacanciesFromPage = Loadable({
  loader: () => import("views/marketing/Vacancies/VacanciesFormPage"),
  loading: FullScreenLoader,
});
const Gallery = Loadable({
  loader: () => import("views/marketing/Gallery"),
  loading: FullScreenLoader,
});
const GalleryFromPage = Loadable({
  loader: () => import("views/marketing/Gallery/GalleryFromPage"),
  loading: FullScreenLoader,
});
export default [
  {
    component: OrderStats,
    path: "/dashboard/orders",
    exact: true,
    title: "Sales",
    permission: "dashboard",
  },
  {
    component: ClientsStatistics,
    path: "/dashboard/clients",
    exact: true,
    title: "Clients",
    permission: "dashboard",
  },
  {
    component: ProductsStatistics,
    path: "/dashboard/products",
    exact: true,
    title: "Products",
    permission: "dashboard",
  },
  {
    component: EmployeesStatistics,
    path: "/dashboard/employees",
    exact: true,
    title: "Employees",
    permission: "dashboard",
  },
  {
    component: OperatorCalls,
    path: "/calls/new",
    exact: true,
    title: "operator.calls",
    permission: "order", // you need to change this
  },

  {
    component: Clients,
    path: "/clients",
    exact: true,
    title: "clients",
    permission: "client",
  },
  {
    component: ClientsFormPage,
    path: "/clients/create",
    exact: true,
    title: "client-create",
    permission: "client",
  },
  {
    component: ClientsFormPage,
    path: "/clients/:id",
    exact: true,
    title: "client-edit",
    permission: "client",
  },
  {
    component: CourierType,
    path: "/personal/couriers/courier-type",
    exact: true,
    title: "CourierType",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/personal/couriers/courier-type/create",
    exact: true,
    title: "CourierTypeCreate",
    permission: "courier",
  },
  {
    component: CourierTypeCreate,
    path: "/personal/couriers/courier-type/:id",
    exact: true,
    title: "CourierTypeEdit",
    permission: "courier",
  },
  {
    component: CourierFare,
    path: "/personal/couriers/courier-fare",
    exact: true,
    title: "CourierFare",
    permission: "courier",
  },
  {
    component: CourierFareCreate,
    path: "/personal/couriers/courier-fare/create",
    exact: true,
    title: "CourierFareCreate",
    permission: "courier",
  },
  {
    component: CourierFareCreate,
    path: "/personal/couriers/courier-fare/:id",
    exact: true,
    title: "CourierFareEdit",
    permission: "courier",
  },
  {
    component: CourierAttendance,
    path: "/personal/couriers/courier-attendance/",
    exact: true,
    title: "CourierFareEdit",
    permission: "courier",
  },
  {
    component: BonusPenaltyComponent,
    path: "/personal/couriers/courier-bonus-penalty/",
    exact: true,
    title: "BonusPenalty",
    permission: "courier",
  },
  {
    component: Account,
    path: "/account",
    exact: true,
    title: "Personal profile",
    permission: "profile",
  },
  {
    component: Orders,
    path: "/orders",
    exact: true,
    title: "orders",
    permission: "order",
  },
  {
    component: OrderForm,
    path: "/orders/create",
    exact: true,
    title: "orderCreate",
    permission: "order",
  },
  {
    component: SendInvoice,
    path: "/orders/sendinvoice",
    exact: true,
    title: "sendInvoice",
    permission: "order",
  },

  {
    component: TrackCourier,
    path: "/orders/trackcourier",
    exact: true,
    title: "trackCourier",
    permission: "map_tracking",
  },
  {
    component: OrderForm,
    path: "/orders/:id",
    exact: true,
    title: "orderCreate",
    permission: "order",
  },
  {
    component: RepeatOrderForm,
    path: "/orders/repeat/:id",
    exact: true,
    title: "orderCreate",
    permission: "order",
  },
  {
    component: Kitchen,
    path: "/kitchen",
    exact: true,
    title: "today.ordered",
    permission: "kitchen",
  },
  {
    component: KitchenHistoryOrders,
    path: "/kitchen-history-orders",
    exact: true,
    title: "history.orders",
    permission: "kitchen",
  },
  {
    component: KitchenCouriers,
    path: "/kitchen-couriers",
    exact: true,
    title: "couriers",
    permission: "kitchen",
  },
  {
    component: KitchenFinance,
    path: "/kitchen/finance",
    exact: true,
    title: "finance",
    permission: "kitchen",
  },
  {
    component: Stocks,
    path: "/marketing/stocks",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: StockCreate,
    path: "/marketing/stocks/create",
    exact: true,
    title: "StockCreate",
    permission: "promotion",
  },
  {
    component: StockCreate,
    path: "/marketing/stocks/:id",
    exact: true,
    title: "StockUpdate",
    permission: "promotion",
  },
  {
    component: SmsSending,
    path: "/marketing/sms-sending",
    exact: true,
    title: "sms_sending",
    permission: "promotion",
  },
  {
    component: NotificationtoApps,
    path: "/marketing/notification-to-apps",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: CreateNotificationtoApps,
    path: "/marketing/notification-to-apps/create",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: Banners,
    path: "/marketing/banners",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: CreateBanner,
    path: "/marketing/banners/create",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: CreateBanner,
    path: "/marketing/banners/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: PopUp,
    path: "/marketing/popup",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: CreatePopUp,
    path: "/marketing/popup/create",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: CreatePopUp,
    path: "/marketing/popup/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "promotion",
  },
  {
    component: News,
    path: "/marketing/news",
    exact: true,
    title: "News",
    permission: "promotion",
  },
  {
    component: NewsFromPage,
    path: "/marketing/news/create",
    exact: true,
    title: "News Create",
    permission: "promotion",
  },
  {
    component: NewsFromPage,
    path: "/marketing/news/:id",
    exact: true,
    title: "News Edit",
    permission: "promotion",
  },
  {
    component: Gallery,
    path: "/marketing/gallery",
    exact: true,
    title: "Gallery",
    permission: "promotion",
  },
  {
    component: GalleryFromPage,
    path: "/marketing/gallery/create",
    exact: true,
    title: "Gallery Create",
    permission: "promotion",
  },
  {
    component: GalleryFromPage,
    path: "/marketing/gallery/:id",
    exact: true,
    title: "Gallery Edit",
    permission: "promotion",
  },
  {
    component: Vacancies,
    path: "/marketing/vacancies",
    exact: true,
    title: "Vacancies",
    permission: "promotion",
  },
  {
    component: VacanciesFromPage,
    path: "/marketing/vacancies/create",
    exact: true,
    title: "Vacancies Create",
    permission: "promotion",
  },
  {
    component: VacanciesFromPage,
    path: "/marketing/vacancies/:id",
    exact: true,
    title: "Vacancies Edit",
    permission: "promotion",
  },
  {
    component: ReportsCourier,
    path: "/reports/courier_report",
    exact: true,
    title: "Reports",
    permission: "report_courier",
  },
  {
    component: AllReports,
    path: "/reports/all_report",
    exact: true,
    title: "Reports",
    permission: "all_report",
  },
  {
    component: ExternalDeliveryReport,
    path: "/reports/external-delivery-report",
    exact: true,
    title: "ExternalDeliveryReport",
    permission: "order_report",
  },
  {
    component: OperatorReports,
    path: "/reports/operator_report",
    exact: true,
    title: "Reports",
    permission: "operator_report",
  },
  {
    component: BranchReports,
    path: "/reports/branch_report",
    exact: true,
    title: "Reports",
    permission: "branch_report",
  },
  {
    component: ProductReports,
    path: "/reports/product_report",
    exact: true,
    title: "Reports",
    permission: "report_product",
  },
  {
    component: AllAggregator,
    path: "/reports/general_aggregator",
    exact: true,
    title: "Reports",
    permission: "reports_general_aggregator",
  },
  {
    component: OrderStatusReport,
    path: "/reports/order_status_report",
    exact: true,
    title: "Reports",
    permission: "order_status_report",
  },
  {
    component: DashboardReport,
    path: "/reports/dashboard_report",
    exact: true,
    title: "Reports",
    permission: "reports_dashboard",
  },
  {
    component: CommentReport,
    path: "/reports/comment_report",
    exact: true,
    title: "Reports",
    permission: "report_comments",
  },
  {
    component: OrderReports,
    path: "/reports/order_report",
    exact: true,
    title: "Reports",
    permission: "order_report",
  },
  {
    component: Forecasting,
    path: "/reports/forecasting",
    exact: true,
    title: "Reports",
    permission: "reports_forecasting",
  },
  {
    component: DeliveryTimeReports,
    path: "/reports/delivery_time_reports",
    exact: true,
    title: "Reports",
    permission: "reports_delivery_time",
  },
  {
    component: CourierInformation,
    path: "/reports/courier/:id",
    exact: true,
    title: "Reports",
    permission: "report",
  },
  {
    component: CustomerReport,
    path: "/reports/customer_report",
    exact: true,
    title: "Reports",
    permission: "reports_customer",
  },
  {
    component: DailyReport,
    path: "/reports/daily-report",
    exact: true,
    title: "Reports",
    permission: "report",
  },
  {
    component: Courier,
    path: "/personal/couriers/list",
    exact: true,
    title: "Courier",
    permission: "courier",
  },
  {
    component: CourierCreate,
    path: "/personal/couriers/list/create",
    exact: true,
    title: "CourierCreate",
    permission: "courier",
  },
  {
    component: CourierCreate,
    path: "/personal/couriers/list/:id",
    exact: true,
    title: "CourierEdit",
    permission: "courier",
  },
  {
    component: BonusPenaltyCreate,
    path: "/personal/couriers/courier-bonus-penalty/create",
    exact: true,
    title: "CourierCreate",
    permission: "courier",
  },
  {
    component: BonusPenaltyCreate,
    path: "/personal/couriers/courier-bonus-penalty/:id",
    exact: true,
    title: "CourierEdit",
    permission: "courier",
  },
  {
    component: Operator,
    path: "/personal/operator",
    exact: true,
    title: "Operator",
    permission: "operator",
  },
  {
    component: OperatorCreate,
    path: "/personal/operator/create",
    exact: true,
    title: "OperatorCreate",
    permission: "operator",
  },
  {
    component: OperatorCreate,
    path: "/personal/operator/:id",
    exact: true,
    title: "OperatorEdit",
    permission: "operator",
  },
  {
    component: Fares,
    path: "/settings/fares",
    exact: true,
    title: "Fares",
    permission: "tariff",
  },
  {
    component: TariffCreate,
    path: "/settings/fares/create",
    exact: true,
    title: "Fares.Create",
    permission: "tariff",
  },
  {
    component: TariffCreate,
    path: "/settings/fares/:id",
    exact: true,
    title: "Fares.Edit",
    permission: "tariff",
  },
  {
    component: Aggregator,
    path: "/settings/aggregator",
    exact: true,
    title: "Aggregator",
    permission: "aggregator",
  },
  {
    component: AggregatorCreate,
    path: "/settings/aggregator/create",
    exact: true,
    title: "Aggregator.Create",
    permission: "aggregator",
  },
  {
    component: AggregatorCreate,
    path: "/settings/aggregator/:id",
    exact: true,
    title: "Aggregator.Edit",
    permission: "aggregator",
  },
  {
    component: Integrations,
    path: "/settings/integrations",
    exact: true,
    title: "Integrations",
    permission: "integrations",
  },
  {
    component: IntegrationsCreate,
    path: "/settings/integrations/create",
    exact: true,
    title: "Integrations.Create",
    permission: "integrations",
  },
  {
    component: IikoEdit,
    path: "/settings/integrations/iiko",
    exact: true,
    title: "Iiko.Edit",
    permission: "integrations",
  },
  {
    component: JowiEdit,
    path: "/settings/integrations/jowi",
    exact: true,
    title: "Jowi.Edit",
    permission: "integrations",
  },
  {
    component: Payme,
    path: "/settings/integrations/payme",
    exact: true,
    title: "Payme",
    permission: "integrations",
  },
  {
    component: PaymeCreate,
    path: "/settings/integrations/payme/create",
    exact: true,
    title: "PaymeCreate",
    permission: "integrations",
  },
  {
    component: PaymeCreate,
    path: "/settings/integrations/payme/:id",
    exact: true,
    title: "PaymeCreate",
    permission: "integrations",
  },
  {
    component: Click,
    path: "/settings/integrations/click",
    exact: true,
    title: "Click",
    permission: "integrations",
  },
  {
    component: ClickCreate,
    path: "/settings/integrations/click/create",
    exact: true,
    title: "ClickCreate",
    permission: "integrations",
  },
  {
    component: ClickCreate,
    path: "/settings/integrations/click/:id",
    exact: true,
    title: "ClickCreate",
    permission: "integrations",
  },
  {
    component: Apelsin,
    path: "/settings/integrations/apelsin",
    exact: true,
    title: "Apelsin",
    permission: "integrations",
  },
  {
    component: ApelsinCreate,
    path: "/settings/integrations/apelsin/create",
    exact: true,
    title: "ApelsinCreate",
    permission: "integrations",
  },
  {
    component: ApelsinCreate,
    path: "/settings/integrations/apelsin/:id",
    exact: true,
    title: "ApelsinCreate",
    permission: "integrations",
  },
  {
    component: Sms,
    path: "/settings/integrations/sms",
    exact: true,
    title: "sms",
    permission: "integrations",
  },
  {
    component: RKeeper,
    path: "/settings/integrations/rkeeper",
    exact: true,
    title: "r_keeper",
    permission: "integrations",
  },
  {
    component: MenuCreateRkeeper,
    path: "/settings/integrations/rkeeper/menu-create",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: MenuCreateComboRkeeper,
    path: "/settings/integrations/rkeeper/menu-create-combo",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: RkeeperBranchCreate,
    path: "/settings/integrations/rkeeper/create-branch",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: RkeeperBranchCreate,
    path: "/settings/integrations/rkeeper/create-branch/:id",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: BranchCreate,
    path: "/settings/integrations/iiko/branch-create",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: MenuCreate,
    path: "/settings/integrations/iiko/menu-create",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: MenuCreateCombo,
    path: "/settings/integrations/iiko/menu-create-combo",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: TerminalCreate,
    path: "/settings/integrations/iiko/terminal-create",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: BranchCreate,
    path: "/settings/integrations/iiko/branch-create/:id",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: JowiBranchCreate,
    path: "/settings/integrations/jowi/branch-create",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: JowiBranchCreate,
    path: "/settings/integrations/jowi/branch-create/:id",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: JowiAddProduct,
    path: "/settings/integrations/jowi/add-product",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: JowiAddProduct,
    path: "/settings/integrations/jowi/add-product/:id",
    exact: true,
    title: "BranchCreate",
    permission: "integrations",
  },
  {
    component: Poster,
    path: "/settings/integrations/poster",
    exact: true,
    title: "Poster",
    permission: "integrations",
  },
  {
    component: IntegrationsYandex,
    path: "/settings/integrations/yandex-delivery",
    exact: true,
    title: "Yandex",
    permission: "integrations",
  },
  {
    component: PosterCreate,
    path: "/settings/integrations/poster/create-branch/:id",
    exact: true,
    title: "PosterBranchCreate",
    permission: "integrations",
  },
  {
    component: PosterCreate,
    path: "/settings/integrations/poster/create-branch",
    exact: true,
    title: "PosterBranchCreate",
    permission: "integrations",
  },
  {
    component: PosterProductCreate,
    path: "/settings/integrations/poster/create-product",
    exact: true,
    title: "PosterCreate",
    permission: "integrations",
  },
  {
    component: PosterProductCreate,
    path: "/settings/integrations/poster/create-product/:id",
    exact: true,
    title: "PosterCreate",
    permission: "integrations",
  },
  {
    component: IntegrationsCreate,
    path: "/settings/integrations/:id",
    exact: true,
    title: "Integrations.Edit",
    permission: "integrations",
  },
  {
    component: UserRoles,
    path: "/settings/user-roles",
    exact: true,
    title: "RoleAccess",
    permission: "role_permission",
  },
  {
    component: UserRolesCreate,
    path: "/settings/user-roles/create",
    exact: true,
    title: "RoleAccess.Create",
    permission: "role_permission",
  },
  {
    component: UserRolesCreate,
    path: "/settings/user-roles/:id",
    exact: true,
    title: "RoleAccess.Edit",
    permission: "role_permission",
  },
  {
    component: Company,
    path: "/settings/company",
    exact: true,
    title: "Company",
    permission: "company",
  },
  {
    component: CompanyBranch,
    path: "/settings/company/branches/create",
    exact: true,
    title: "Company.Branches",
    permission: "company",
  },
  {
    component: CompanyBranch,
    path: "/settings/company/branches/:id",
    exact: true,
    title: "Company.Branches",
    permission: "company",
  },
  {
    component: AddBranchUsers,
    path: "/settings/company/add-branch-users/:id",
    exact: true,
    title: "AddBranchUsers",
    permission: "company",
  },
  {
    component: CreateRegion,
    path: "/settings/company/regions/create",
    exact: true,
    title: "Regions",
    permission: "company",
  },
  {
    component: CreateGeozone,
    path: "/settings/company/geozone/create",
    exact: true,
    title: "Geozones",
    permission: "company",
  },
  {
    component: CreateGeozone,
    path: "/settings/company/geozone/:id",
    exact: true,
    title: "Geozones",
    permission: "company",
  },
  {
    component: CreateFreeGeozone,
    path: "/settings/company/free-geozone/create",
    exact: true,
    title: "Geozones",
    permission: "company",
  },
  {
    component: CreateFreeGeozone,
    path: "/settings/company/free-geozone/:id",
    exact: true,
    title: "Geozones",
    permission: "company",
  },
  {
    component: CreateRegion,
    path: "/settings/company/regions/:id",
    exact: true,
    title: "Update.Regions",
    permission: "company",
  },
  {
    component: CompanyBranchCashiers,
    path: "/settings/company/branches/:id/cashiers/:cashier_id",
    exact: true,
    title: "Branches.Cashiers",
    permission: "company",
  },
  {
    component: BotSettings,
    path: "/settings/bot-settings",
    exact: true,
    title: "BotSettings",
    permission: "company",
  },
  {
    component: SMSTemplate,
    path: "/settings/sms-template",
    exact: true,
    title: "SMSTemplate",
    permission: "company",
  },
  {
    component: ContentReviews,
    path: "/settings/content/reviews",
    exact: true,
    title: "Content.Reviews",
    permission: "reviews",
  },
  {
    component: ContentReviewsCreate,
    path: "/settings/content/reviews/create",
    exact: true,
    title: "Content.Reviews.Create",
    permission: "reviews",
  },
  {
    component: ContentReviewsCreate,
    path: "/settings/content/reviews/:id",
    exact: true,
    title: "Content.Reviews.Edit",
    permission: "reviews",
  },
  {
    component: ContentCancels,
    path: "/settings/content/cancel-reasons",
    exact: true,
    title: "Content.Cancels",
    permission: "cancel_reason",
  },
  {
    component: ContentCancelsCreate,
    path: "/settings/content/cancel-reasons/create",
    exact: true,
    title: "Content.Cancels.Create",
    permission: "cancel_reason",
  },
  {
    component: ContentCancelsCreate,
    path: "/settings/content/cancel-reasons/:id",
    exact: true,
    title: "Content.Cancels.Edit",
    permission: "cancel_reason",
  },
  {
    component: ContentCompletions,
    path: "/settings/content/completion-reasons",
    exact: true,
    title: "Content.Completions",
    permission: "completion_reasons",
  },
  {
    component: ContentCompletionsCreate,
    path: "/settings/content/completion-reasons/create",
    exact: true,
    title: "Content.Completions.Create",
    permission: "completion_reasons",
  },
  {
    component: ContentCompletionsCreate,
    path: "/settings/content/completion-reasons/:id",
    exact: true,
    title: "Content.Completions.Edit",
    permission: "completion_reasons",
  },
  {
    component: ContentSettings,
    path: "/settings/content-settings",
    exact: true,
    title: "content.settings",
    permission: "company",
  },
  {
    component: ContentTelegramPost,
    path: "/marketing/telegram-post",
    exact: true,
    title: "telegram.post",
    permission: "promotion",
  },
  {
    component: CreateTelegramPost,
    path: "/marketing/telegram-post/create",
    exact: true,
    title: "telegram.post",
    permission: "promotion",
  },
  {
    component: SettingsMenu,
    path: "/catalog/menu",
    exact: true,
    title: "menu",
    permission: "product",
  },
  {
    component: SettingsCreateMenu,
    path: "/catalog/menu/create-menu",
    exact: true,
    title: "menu",
    permission: "product",
  },
  {
    component: SettingsEditMenu,
    path: "/catalog/menu/edit-menu/:id",
    exact: true,
    title: "menu",
    permission: "product",
  },
  {
    component: SettingsCatalogGoods,
    path: "/catalog/goods",
    exact: true,
    title: "Settings.Catalog.Goods",
    permission: "product",
  },
  {
    component: SettingsCatalogGoodsCreate,
    path: "/catalog/goods/create",
    exact: true,
    title: "Settings.Catalog.Goods.Create",
    permission: "product",
  },
  {
    component: SettingsCatalogGoodsCreate,
    path: "/catalog/goods/:id",
    exact: true,
    title: "Settings.Catalog.Goods.Edit",
    permission: "product",
  },
  {
    component: SettingsCatalogCategory,
    path: "/catalog/category",
    exact: true,
    title: "Settings.Catalog.Category",
    permission: "category",
  },
  {
    component: SettingsCatalogCategoryProduct,
    path: "/catalog/category/create",
    exact: true,
    title: "Settings.Catalog.Product.Create",
    permission: "category",
  },
  {
    component: SettingsCatalogCategoryProduct,
    path: "/catalog/category/:id",
    exact: true,
    title: "Settings.Catalog.Product.Edit",
    permission: "category",
  },
  {
    component: SettingsCatalogAttributes,
    path: "/catalog/attributes",
    exact: true,
    title: "Settings.Catalog.Attributes",
    permission: "attributes",
  },
  {
    component: SettingsCatalogAttributesCreate,
    path: "/catalog/attributes/create",
    exact: true,
    title: "Settings.Catalog.Attribute.Create",
    permission: "attributes",
  },
  {
    component: SettingsCatalogAttributesCreate,
    path: "/catalog/attributes/:id",
    exact: true,
    title: "Settings.Catalog.Attribute.Edit",
    permission: "attributes",
  },
  {
    component: SettingsCatalogUnits,
    path: "/catalog/units",
    exact: true,
    title: "Settings.Catalog.Unit",
    permission: "units",
  },
  {
    component: SettingsCatalogUnitsCreate,
    path: "/catalog/units/create",
    exact: true,
    title: "Settings.Catalog.Unit.Create",
    permission: "units",
  },
  {
    component: SettingsCatalogUnitsCreate,
    path: "/catalog/units/:id",
    exact: true,
    title: "Settings.Catalog.Unit.Edit",
    permission: "units",
  },
  {
    component: SettingsCatalogTags,
    path: "/catalog/tags",
    exact: true,
    title: "Settings.Catalog.Tags",
    permission: "tags",
  },
  {
    component: SettingsCatalogTagsCreate,
    path: "/catalog/tags/create",
    exact: true,
    title: "Settings.Catalog.Tag.Create",
    permission: "tags",
  },
  {
    component: SettingsCatalogTagsCreate,
    path: "/catalog/tags/:id",
    exact: true,
    title: "Settings.Catalog.Tag.Edit",
    permission: "tags",
  },
  {
    component: SettingsCatalogABCXYZ,
    path: "/catalog/abcxyz",
    exact: true,
    title: "ABCXYZ",
    permission: "product",
  },
  {
    component: IikoCourierConnect,
    path: "/settings/integrations/iiko/courier-connect",
    exact: true,
    title: "courier_connect",
    permission: "integrations",
  },
  {
    component: Balance,
    path: "/settings/balance",
    exact: true,
    title: "balance",
    permission: "balance",
  },
  {
    component: SettingsCatalogBrands,
    path: "/catalog/brands",
    exact: true,
    title: "Settings.Catalog.Brands",
    permission: "brands",
  },
  {
    component: SettingsCatalogBrandsCreate,
    path: "/catalog/brands/create",
    exact: true,
    title: "Settings.Catalog.Brand.Create",
    permission: "brands",
  },
  {
    component: SettingsCatalogBrandsCreate,
    path: "/catalog/brands/:id",
    exact: true,
    title: "Settings.Catalog.Brand.Edit",
    permission: "brands",
  },
  {
    component: Notifications,
    path: "/notifications",
    exact: true,
    title: "Notifications",
    permission: "notification",
  },
  {
    component: Discounts,
    path: "/settings/discounts",
    exact: true,
    title: "Discounts",
    permission: "discounts",
  },
  {
    component: DiscountsFormPage,
    path: "/settings/discounts/create",
    exact: true,
    title: "add_surcharge_or_discount",
    permission: "discounts",
  },
  {
    component: DiscountsFormPage,
    path: "/settings/discounts/:id",
    exact: true,
    title: "edit_surcharge_or_discount",
    permission: "discounts",
  },
  {
    component: GPTReport,
    path: "/reports/gpt-report",
    exact: true,
    title: "gpt-report",
    permission: "all_report",
  },
].map((route) => ({
  ...route,
  path: `/home${route.path}`,
  id: route.path + route.title + route.permission,
}));
