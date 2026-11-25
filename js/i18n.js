/* ---------- UI strings ---------- */
const UI = {
  en:{brandSub:"Alternative Investments",navAbout:"About",navFunds:"Funds",navContact:"Contact",
    heroEyebrow:"Curated Credit Platform",
    heroTitle:"<b>Institutional credit,</b><br>selected with discipline.",
    heroBody:"A focused shelf of liquid and semi-liquid strategies, chosen through our manager research process for durable income, drawdown control and transparent liquidity terms.",
    stPipeline:"Funds in Pipeline",stGPs:"GPs Covered",stCategories:"Strategy Categories",stStrategies:"Featured Strategies",stAum:"Combined Fund AUM",stLiq:"Liquidity Profiles",stTrack:"Longest Track Record",
    secEyebrow:"Our Fund Shelf",secTitle:"Featured Strategies",
    secBody:"Browse strategies by liquidity profile. Select any fund for its full profile, calendar-year performance, drawdowns and redemption terms.",
    tabLiquid:"Liquid",tabIlliquid:"Semi-Liquid / Private",
    descLiquid:"UCITS vehicles with daily dealing. Source: Man Group monthly factsheets as of 30 Oct 2026.",
    descIlliquid:"Private hedge funds with periodic liquidity, notice periods, gates and soft locks. Sources: manager decks and monthly reports.",
    aum:"Fund AUM",inception:"Inception",ann:"Ann. (full yrs)",annual:"Annual Returns",maxdd:"Max Drawdown",recent5:"Last 5 Calendar Years",
    wm:"Worst Month",wm20:"Worst Month (since 2020)",wy:"Worst Year",noNeg:"No negative year",view:"View Fund",
    overview:"Strategy Overview",facts:"Key Facts",vehicle:"Vehicle",dealing:"Dealing",liqTerms:"Liquidity Terms",
    perfTitle:"Calendar-Year Performance",period:"Period",ret:"Return",daily:"Daily",dailyFull:"Daily subscriptions and redemptions.",
    private:"Private fund",past:"Past performance is not indicative of future results. Source: manager factsheets and marketing materials.",
    
    division:"Alternative Investments Division",yrs:n=>n+" yrs",
    disclaimer:"For professional investors only. This material is for discussion purposes and does not constitute an offer to sell or a solicitation of an offer to buy any security. Past performance is not indicative of future results. Performance figures are sourced from manager factsheets and marketing materials and may be net or gross of fees as noted per fund. Investments in private funds are subject to lock-ups, gates and redemption restrictions."},
  sc:{brandSub:"另类投资",navAbout:"关于我们",navFunds:"基金",navContact:"联系我们",
    heroEyebrow:"精选信贷平台",
    heroTitle:"<b>机构级信贷，</b><br>以严谨标准甄选。",
    heroBody:"一组精选的流动性与半流动性策略，经我们的管理人研究流程筛选，注重稳健收益、回撤控制与透明的流动性条款。",
    stPipeline:"只基金项目储备",stGPs:"覆盖GP数量",stCategories:"大类投资策略",stStrategies:"精选策略",stAum:"基金规模合计",stLiq:"流动性类别",stTrack:"最长业绩记录",
    secEyebrow:"基金精选",secTitle:"精选策略",
    secBody:"按流动性类别浏览策略。点击任一基金，查看完整介绍、历年业绩、最大回撤及赎回条款。",
    tabLiquid:"流动性基金",tabIlliquid:"半流动性 / 私募",
    descLiquid:"UCITS 结构，每日申赎。数据来源：Man Group 官方月度 Factsheet，截至2026年10月30日。",
    descIlliquid:"私募对冲基金，定期开放，设有赎回通知期、赎回闸门及软锁定期。数据来源：各基金推介材料及月报。",
    aum:"基金规模",inception:"成立年份",ann:"年化回报(完整年度)",annual:"年度表现",maxdd:"最大回撤",recent5:"近五年年度业绩",
    wm:"最差单月",wm20:"最差单月 (2020年以来)",wy:"最差年度",noNeg:"无负年度",view:"查看详情",
    overview:"策略概述",facts:"基本信息",vehicle:"产品结构",dealing:"申赎频率",liqTerms:"流动性条款",
    perfTitle:"历年业绩",period:"期间",ret:"回报",daily:"每日",dailyFull:"每日申购及赎回。",
    private:"私募基金",past:"过往业绩不代表未来表现。数据来源：基金管理人月报及推介材料。",
    
    division:"另类投资部",yrs:n=>n+"年",
    disclaimer:"仅供专业投资者参考。本材料仅作讨论用途，不构成任何证券的出售要约或购买要约邀请。过往业绩不代表未来表现。业绩数据来源于基金管理人月报及推介材料，是否扣费以各基金注明为准。私募基金投资受锁定期、赎回闸门及其他赎回限制约束。"},
  tc:{brandSub:"另類投資",navAbout:"關於我們",navFunds:"基金",navContact:"聯絡我們",
    heroEyebrow:"精選信貸平台",
    heroTitle:"<b>機構級信貸，</b><br>以嚴謹標準甄選。",
    heroBody:"一組精選的流動性與半流動性策略，經我們的管理人研究流程篩選，注重穩健收益、回撤控制與透明的流動性條款。",
    stPipeline:"隻基金項目儲備",stGPs:"覆蓋GP數量",stCategories:"大類投資策略",stStrategies:"精選策略",stAum:"基金規模合計",stLiq:"流動性類別",stTrack:"最長業績記錄",
    secEyebrow:"基金精選",secTitle:"精選策略",
    secBody:"按流動性類別瀏覽策略。點擊任一基金，查看完整介紹、歷年業績、最大回撤及贖回條款。",
    tabLiquid:"流動性基金",tabIlliquid:"半流動性 / 私募",
    descLiquid:"UCITS 結構，每日申贖。資料來源：Man Group 官方月度 Factsheet，截至2026年10月30日。",
    descIlliquid:"私募對沖基金，定期開放，設有贖回通知期、贖回閘門及軟鎖定期。資料來源：各基金推介材料及月報。",
    aum:"基金規模",inception:"成立年份",ann:"年化回報(完整年度)",annual:"年度表現",maxdd:"最大回撤",recent5:"近五年年度業績",
    wm:"最差單月",wm20:"最差單月 (2020年以來)",wy:"最差年度",noNeg:"無負年度",view:"查看詳情",
    overview:"策略概述",facts:"基本資料",vehicle:"產品結構",dealing:"申贖頻率",liqTerms:"流動性條款",
    perfTitle:"歷年業績",period:"期間",ret:"回報",daily:"每日",dailyFull:"每日申購及贖回。",
    private:"私募基金",past:"過往業績不代表未來表現。資料來源：基金管理人月報及推介材料。",
    
    division:"另類投資部",yrs:n=>n+"年",
    disclaimer:"僅供專業投資者參考。本材料僅作討論用途，不構成任何證券的出售要約或購買要約邀請。過往業績不代表未來表現。業績數據來源於基金管理人月報及推介材料，是否扣費以各基金註明為準。私募基金投資受鎖定期、贖回閘門及其他贖回限制約束。"}
};

/* ---------- Login + Add Fund strings ---------- */
Object.assign(UI.en,{
  loginTitle:"Investor Access",loginSub:"For professional investors only. Please sign in to continue.",
  username:"Username",password:"Password",signIn:"Sign In",cancel:"Cancel",loginErr:"Incorrect username or password.",
  loginBtn:"Log In",logout:"Log Out",addFund:"+ Add Fund",
  afTitle:"Add a New Fund",afCategory:"Category",afName:"Fund name",afMgr:"Manager",afTag:"Strategy label",afVehicle:"Vehicle",
  afInception:"Inception month",afAum:"Fund size (US$ bn)",afStrategy:"Strategy description",afLiq:"Dealing (short)",afLiqFull:"Liquidity terms (full, optional)",
  afReturns:"Calendar-year returns",afReturnsHelp:"One year per line, for example  2024: 12.5",
  afYtd:"Year-to-date return % (optional)",afYtdTo:"YTD through month",afWm:"Worst month % (optional)",afWmAt:"Worst month date",
  afNote:"Source note (optional)",save:"Save Fund",del:"Delete This Fund",confirmDelete:"Delete this fund? This cannot be undone.",
  phTag:"e.g. Global High Yield",phVehicle:"e.g. UCITS or Private fund",phLiq:"e.g. Monthly, 30-day notice",
  errRequired:"Please fill in every field that is not marked optional.",
  errReturns:"Enter at least one yearly return, one per line, like  2024: 12.5  (each year only once).",
  errAum:"Fund size must be a number above zero.",errYtd:"For a year-to-date figure, fill in both the return and the month, and use a year later than the yearly returns.",
  errWm:"For the worst month, fill in both the return and the date.",errAdmin:"Only an admin can add funds.",
  errStorage:"The fund is shown now, but this browser would not save it, so it will disappear on reload."
});
Object.assign(UI.sc,{
  loginTitle:"投资者登录",loginSub:"仅供专业投资者使用，请登录后继续。",
  username:"用户名",password:"密码",signIn:"登录",cancel:"取消",loginErr:"用户名或密码不正确。",
  loginBtn:"登录",logout:"退出",addFund:"+ 新增基金",
  afTitle:"新增基金",afCategory:"类别",afName:"基金名称",afMgr:"管理人",afTag:"策略标签",afVehicle:"产品结构",
  afInception:"成立月份",afAum:"基金规模 (十亿美元)",afStrategy:"策略描述",afLiq:"申赎频率 (简述)",afLiqFull:"流动性条款 (完整，选填)",
  afReturns:"历年年度回报",afReturnsHelp:"每行一年，例如  2024: 12.5",
  afYtd:"年初至今回报 % (选填)",afYtdTo:"年初至今截至月份",afWm:"最差单月 % (选填)",afWmAt:"最差单月日期",
  afNote:"来源备注 (选填)",save:"保存基金",del:"删除此基金",confirmDelete:"确定删除此基金？此操作无法撤销。",
  phTag:"例如：全球高收益债",phVehicle:"例如：UCITS 或 私募基金",phLiq:"例如：每月，提前30天",
  errRequired:"请填写所有未标注“选填”的栏目。",
  errReturns:"请至少输入一个年度回报，每行一年，例如  2024: 12.5  (每个年份只能出现一次)。",
  errAum:"基金规模必须是大于零的数字。",errYtd:"填写年初至今数据时，须同时填写回报与月份，且年份须晚于年度回报中的年份。",
  errWm:"填写最差单月时，须同时填写回报与日期。",errAdmin:"仅管理员可新增基金。",
  errStorage:"基金已显示，但此浏览器未能保存，刷新后将消失。"
});
Object.assign(UI.tc,{
  loginTitle:"投資者登入",loginSub:"僅供專業投資者使用，請登入後繼續。",
  username:"使用者名稱",password:"密碼",signIn:"登入",cancel:"取消",loginErr:"使用者名稱或密碼不正確。",
  loginBtn:"登入",logout:"登出",addFund:"+ 新增基金",
  afTitle:"新增基金",afCategory:"類別",afName:"基金名稱",afMgr:"管理人",afTag:"策略標籤",afVehicle:"產品結構",
  afInception:"成立月份",afAum:"基金規模 (十億美元)",afStrategy:"策略描述",afLiq:"申贖頻率 (簡述)",afLiqFull:"流動性條款 (完整，選填)",
  afReturns:"歷年年度回報",afReturnsHelp:"每行一年，例如  2024: 12.5",
  afYtd:"年初至今回報 % (選填)",afYtdTo:"年初至今截至月份",afWm:"最差單月 % (選填)",afWmAt:"最差單月日期",
  afNote:"來源備註 (選填)",save:"儲存基金",del:"刪除此基金",confirmDelete:"確定刪除此基金？此操作無法復原。",
  phTag:"例如：全球高收益債",phVehicle:"例如：UCITS 或 私募基金",phLiq:"例如：每月，提前30天",
  errRequired:"請填寫所有未標註「選填」的欄位。",
  errReturns:"請至少輸入一個年度回報，每行一年，例如  2024: 12.5  (每個年份只能出現一次)。",
  errAum:"基金規模必須是大於零的數字。",errYtd:"填寫年初至今數據時，須同時填寫回報與月份，且年份須晚於年度回報中的年份。",
  errWm:"填寫最差單月時，須同時填寫回報與日期。",errAdmin:"僅管理員可新增基金。",
  errStorage:"基金已顯示，但此瀏覽器未能儲存，重新整理後將消失。"
});

/* Liquid-tab description for investors: same text without the manager's name */
UI.en.descLiquidAnon="UCITS vehicles with daily dealing. Source: manager monthly factsheets as of 30 Oct 2026.";
UI.sc.descLiquidAnon="UCITS 结构，每日申赎。数据来源：管理人官方月度 Factsheet，截至2026年10月30日。";
UI.tc.descLiquidAnon="UCITS 結構，每日申贖。資料來源：管理人官方月度 Factsheet，截至2026年10月30日。";
