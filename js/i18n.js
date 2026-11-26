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

/* ---------- Add Funds from a PPTX deck ---------- */
Object.assign(UI.en,{
  imTitle:"Add Funds from a Deck",
  imIntro:"Upload a fund screening deck (.pptx). Each column of the comparison table on each slide becomes one fund card. Text is shown as written in the deck.",
  imChoose:"Choose a .pptx file",imReading:"Reading the deck…",
  imFound:(n,file)=>`${n} fund${n===1?"":"s"} found in ${file}. Check the names, then add the ones you want.`,
  imNone:"No fund comparison table was found. The deck needs a table with one fund per column and rows such as 成立日期, 基金规模, 基金策略, 表现 and 流动性.",
  imBad:"This file could not be read as a PowerPoint (.pptx) file.",
  imName:"Fund name (admin view only)",imSlide:"Slide",imInclude:"Include this fund",
  imReturns:n=>`${n} period${n===1?"":"s"} found`,imNoReturns:"No yearly returns in the deck. The card will show the track record text instead.",
  imAdd:"Add Selected Funds",imNoneSel:"Tick at least one fund, and give every ticked fund a name.",
  newFund:"New",target:"Target return",trackRecord:"Track Record"
});
Object.assign(UI.sc,{
  imTitle:"从PPT导入基金",
  imIntro:"上传基金筛选汇报 (.pptx)。每页比较表中的每一列将生成一张基金卡片，文字按PPT原文显示。",
  imChoose:"选择 .pptx 文件",imReading:"正在读取…",
  imFound:(n,file)=>`在 ${file} 中找到 ${n} 只基金。请核对名称后添加。`,
  imNone:"未找到基金比较表。PPT 需包含一张表格：每列一只基金，行标题如 成立日期、基金规模、基金策略、表现、流动性。",
  imBad:"无法将此文件读取为 PowerPoint (.pptx) 文件。",
  imName:"基金名称 (仅管理员可见)",imSlide:"第",imInclude:"包含此基金",
  imReturns:n=>`找到 ${n} 个期间`,imNoReturns:"PPT 中没有年度回报，卡片将显示业绩记录文字。",
  imAdd:"添加所选基金",imNoneSel:"请至少勾选一只基金，并为每只勾选的基金填写名称。",
  newFund:"新发",target:"目标回报",trackRecord:"业绩记录"
});
Object.assign(UI.tc,{
  imTitle:"從PPT匯入基金",
  imIntro:"上傳基金篩選匯報 (.pptx)。每頁比較表中的每一列將生成一張基金卡片，文字按PPT原文顯示。",
  imChoose:"選擇 .pptx 檔案",imReading:"正在讀取…",
  imFound:(n,file)=>`在 ${file} 中找到 ${n} 隻基金。請核對名稱後新增。`,
  imNone:"未找到基金比較表。PPT 需包含一張表格：每列一隻基金，行標題如 成立日期、基金規模、基金策略、表現、流動性。",
  imBad:"無法將此檔案讀取為 PowerPoint (.pptx) 檔案。",
  imName:"基金名稱 (僅管理員可見)",imSlide:"第",imInclude:"包含此基金",
  imReturns:n=>`找到 ${n} 個期間`,imNoReturns:"PPT 中沒有年度回報，卡片將顯示業績記錄文字。",
  imAdd:"新增所選基金",imNoneSel:"請至少勾選一隻基金，並為每隻勾選的基金填寫名稱。",
  newFund:"新發",target:"目標回報",trackRecord:"業績記錄"
});

UI.en.imHide="Words hidden from investors (comma-separated)";
UI.sc.imHide="对投资者隐藏的词 (用逗号分隔)";
UI.tc.imHide="對投資者隱藏的詞 (用逗號分隔)";

/* drag-and-drop wording for the deck upload */
UI.en.imDrop="Drag a .pptx deck here";   UI.en.imChoose="or click to choose a file";
UI.sc.imDrop="将 .pptx 文件拖到此处";      UI.sc.imChoose="或点击选择文件";
UI.tc.imDrop="將 .pptx 檔案拖到此處";      UI.tc.imChoose="或點擊選擇檔案";

/* ---------- Strategy tabs ---------- */
Object.assign(UI.en,{
  addStrategy:"+ Add Strategy",stratPh:"Strategy name",stratAdd:"Add",stratDelete:"Delete this strategy",
  stratExists:"A strategy with this name already exists.",
  stratDelConfirm:(name,n)=>`Delete the strategy "${name}"${n?` and the ${n} fund${n===1?"":"s"} in it`:""}? This cannot be undone.`,
  afCategory:"Strategy",imNewStrat:"Or put these funds under a new strategy",imCreate:"Create"
});
Object.assign(UI.sc,{
  addStrategy:"+ 新增策略",stratPh:"策略名称",stratAdd:"添加",stratDelete:"删除此策略",
  stratExists:"已存在同名策略。",
  stratDelConfirm:(name,n)=>`确定删除策略“${name}”${n?`及其中的 ${n} 只基金`:""}？此操作无法撤销。`,
  afCategory:"策略",imNewStrat:"或将这些基金放入新策略",imCreate:"创建"
});
Object.assign(UI.tc,{
  addStrategy:"+ 新增策略",stratPh:"策略名稱",stratAdd:"新增",stratDelete:"刪除此策略",
  stratExists:"已存在同名策略。",
  stratDelConfirm:(name,n)=>`確定刪除策略「${name}」${n?`及其中的 ${n} 隻基金`:""}？此操作無法復原。`,
  afCategory:"策略",imNewStrat:"或將這些基金放入新策略",imCreate:"建立"
});

/* ---------- Edit / delete a fund ---------- */
Object.assign(UI.en,{
  edit:"Edit Fund",del:"Delete Fund",efTitle:"Edit Fund",efSave:"Save Changes",
  efInception:"Inception month",efInceptionText:"Inception text (optional)",efAum:"Fund size (US$ bn)",efAumText:"Fund size text (optional)",
  efTarget:"Target return (optional)",efReturns:"Returns by period",
  efReturnsHelp:"One period per line.  Full year: 2024: 12.5    Part year from June: 2022 from 6: 15.62    Year to date through October: 2026 YTD 10: 4.78",
  efNotes:"Track record notes (one per line, optional)",efDd:"Drawdown / loss text (optional)",efLiqFull:"Liquidity terms (full, optional)",efNote:"Source note (admins only, optional)",
  efErrRequired:"The fund name and the strategy label cannot be empty.",
  efErrReturns:"Check the returns: one period per line, like  2024: 12.5 ,  2022 from 6: 15.62  or  2026 YTD 10: 4.78 , and each period only once.",
  confirmDeleteBuiltIn:"Delete this fund from the site? You can bring it back later with \"Restore original funds\".",
  restore:"Restore original funds",restoreConfirm:"Undo every edit and deletion of the original funds? Funds and strategies you added are kept."
});
Object.assign(UI.sc,{
  edit:"编辑基金",del:"删除基金",efTitle:"编辑基金",efSave:"保存修改",
  efInception:"成立月份",efInceptionText:"成立说明 (选填)",efAum:"基金规模 (十亿美元)",efAumText:"规模说明 (选填)",
  efTarget:"目标回报 (选填)",efReturns:"各期间回报",
  efReturnsHelp:"每行一个期间。完整年度：2024: 12.5    自6月起的部分年度：2022 from 6: 15.62    年初至10月：2026 YTD 10: 4.78",
  efNotes:"业绩记录备注 (每行一条，选填)",efDd:"回撤 / 损失说明 (选填)",efLiqFull:"流动性条款 (完整，选填)",efNote:"来源备注 (仅管理员可见，选填)",
  efErrRequired:"基金名称和策略标签不能为空。",
  efErrReturns:"请检查回报：每行一个期间，例如  2024: 12.5 、 2022 from 6: 15.62  或  2026 YTD 10: 4.78 ，且每个期间只能出现一次。",
  confirmDeleteBuiltIn:"确定从网站删除此基金？之后可通过“恢复原始基金”找回。",
  restore:"恢复原始基金",restoreConfirm:"撤销对原始基金的所有修改和删除？您新增的基金和策略将保留。"
});
Object.assign(UI.tc,{
  edit:"編輯基金",del:"刪除基金",efTitle:"編輯基金",efSave:"儲存修改",
  efInception:"成立月份",efInceptionText:"成立說明 (選填)",efAum:"基金規模 (十億美元)",efAumText:"規模說明 (選填)",
  efTarget:"目標回報 (選填)",efReturns:"各期間回報",
  efReturnsHelp:"每行一個期間。完整年度：2024: 12.5    自6月起的部分年度：2022 from 6: 15.62    年初至10月：2026 YTD 10: 4.78",
  efNotes:"業績記錄備註 (每行一條，選填)",efDd:"回撤 / 損失說明 (選填)",efLiqFull:"流動性條款 (完整，選填)",efNote:"來源備註 (僅管理員可見，選填)",
  efErrRequired:"基金名稱和策略標籤不能為空。",
  efErrReturns:"請檢查回報：每行一個期間，例如  2024: 12.5 、 2022 from 6: 15.62  或  2026 YTD 10: 4.78 ，且每個期間只能出現一次。",
  confirmDeleteBuiltIn:"確定從網站刪除此基金？之後可透過「恢復原始基金」找回。",
  restore:"恢復原始基金",restoreConfirm:"撤銷對原始基金的所有修改和刪除？您新增的基金和策略將保留。"
});

/* ---------- Translation with the Claude API ---------- */
Object.assign(UI.en,{
  keyTitle:"Automatic translation (Claude API key)",
  keyHelp:"With a key saved, funds you add are translated into English, 简体 and 繁體 by Claude. The key is kept only in this browser and sent only to Anthropic. Use a key with a spend limit, and remove it on a shared computer.",
  keyLabel:"Claude API key",keySave:"Save Key",keyRemove:"Remove Key",
  keySaved:"A key is saved in this browser. New funds will be translated automatically.",
  keyNone:"No key saved. New funds are added in the deck's own language only.",
  translate:"Translate",retranslate:"Translate Again",
  trNoKey:"Funds added in the deck's language. Save a Claude API key in the Add Fund window to translate them.",
  trWorking:(d,n)=>`Translating funds with Claude… ${d} of ${n} done`,
  trDone:n=>`${n} fund${n===1?"":"s"} translated into English, 简体 and 繁體.`,
  trFailed:(k,n)=>`${k} of ${n} fund${n===1?"":"s"} could not be translated and stay in the deck's language.`,
  trErr_key:"The API key was rejected. Check it in the Add Fund window.",
  trErr_rate:"The API rate limit was reached. Try Translate again in a minute.",
  trErr_network:"Could not reach the translation service. Check the internet connection.",
  trErr_refused:"The request was declined by the model.",
  trErr_cut:"The text was too long to translate in one go.",
  trErr_api:"The API returned an error:"
});
Object.assign(UI.sc,{
  keyTitle:"自动翻译 (Claude API 密钥)",
  keyHelp:"保存密钥后，新增的基金将由 Claude 翻译为 English、简体和繁體。密钥仅保存在此浏览器中，且只发送给 Anthropic。请使用设有支出上限的密钥，并在共用电脑上将其移除。",
  keyLabel:"Claude API 密钥",keySave:"保存密钥",keyRemove:"移除密钥",
  keySaved:"此浏览器已保存密钥，新增基金将自动翻译。",
  keyNone:"尚未保存密钥，新增基金仅以PPT原文语言显示。",
  translate:"翻译",retranslate:"重新翻译",
  trNoKey:"基金已按PPT原文语言添加。在“新增基金”窗口保存 Claude API 密钥后即可翻译。",
  trWorking:(d,n)=>`正在使用 Claude 翻译基金… 已完成 ${d} / ${n}`,
  trDone:n=>`已将 ${n} 只基金翻译为 English、简体和繁體。`,
  trFailed:(k,n)=>`${n} 只基金中有 ${k} 只未能翻译，仍以PPT原文语言显示。`,
  trErr_key:"API 密钥被拒绝，请在“新增基金”窗口检查。",
  trErr_rate:"已达到 API 速率上限，请稍后再点“翻译”。",
  trErr_network:"无法连接翻译服务，请检查网络连接。",
  trErr_refused:"模型拒绝了该请求。",
  trErr_cut:"文本过长，无法一次完成翻译。",
  trErr_api:"API 返回错误："
});
Object.assign(UI.tc,{
  keyTitle:"自動翻譯 (Claude API 金鑰)",
  keyHelp:"儲存金鑰後，新增的基金將由 Claude 翻譯為 English、简体和繁體。金鑰僅儲存在此瀏覽器中，且只傳送給 Anthropic。請使用設有支出上限的金鑰，並在共用電腦上將其移除。",
  keyLabel:"Claude API 金鑰",keySave:"儲存金鑰",keyRemove:"移除金鑰",
  keySaved:"此瀏覽器已儲存金鑰，新增基金將自動翻譯。",
  keyNone:"尚未儲存金鑰，新增基金僅以PPT原文語言顯示。",
  translate:"翻譯",retranslate:"重新翻譯",
  trNoKey:"基金已按PPT原文語言新增。在「新增基金」視窗儲存 Claude API 金鑰後即可翻譯。",
  trWorking:(d,n)=>`正在使用 Claude 翻譯基金… 已完成 ${d} / ${n}`,
  trDone:n=>`已將 ${n} 隻基金翻譯為 English、简体和繁體。`,
  trFailed:(k,n)=>`${n} 隻基金中有 ${k} 隻未能翻譯，仍以PPT原文語言顯示。`,
  trErr_key:"API 金鑰被拒絕，請在「新增基金」視窗檢查。",
  trErr_rate:"已達到 API 速率上限，請稍後再點「翻譯」。",
  trErr_network:"無法連接翻譯服務，請檢查網路連線。",
  trErr_refused:"模型拒絕了該請求。",
  trErr_cut:"文字過長，無法一次完成翻譯。",
  trErr_api:"API 傳回錯誤："
});

/* ---------- Saving to GitHub (shared data + translation by workflow) ---------- */
Object.assign(UI.en,{
  ghTitle:"Save for everyone (GitHub token)",
  ghHelp:"Changes are saved to the site's GitHub repository, so every visitor sees them, and new funds are translated there automatically. This needs a GitHub token.<br><br><b>To create one:</b> on GitHub open Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Under Repository access choose <b>Only select repositories → fund-pitch</b>. Under Permissions set <b>Contents: Read and write</b>. Paste the token below. It is kept only in this browser and sent only to GitHub.",
  ghLabel:"GitHub token",ghSave:"Save Token",ghRemove:"Remove Token",
  ghTokenSaved:"A token is saved in this browser. Your changes are saved for everyone.",
  ghTokenNone:"No token saved. You can look around, but changes cannot be saved.",
  ghTokenOk:"The token works. Your changes will be saved for everyone.",
  ghNeedToken:"To change funds, first save a GitHub token: click + Add Fund and open \"Save for everyone\".",
  ghNeedTokenHere:"Save a GitHub token first, under \"Save for everyone\" below.",
  ghSaving:"Saving for everyone…",
  ghSaved:"Saved. Other visitors will see it once the site republishes, usually within a couple of minutes.",
  ghSavedTranslating:n=>`Saved. Translating ${n} fund${n===1?"":"s"} on GitHub. This page updates when it is done.`,
  ghTranslated:"Translation finished. The funds are now in English, 简体 and 繁體.",
  ghTranslateSlow:"The translation has not finished. Open the Actions tab of the GitHub repository to see why; the ANTHROPIC_API_KEY secret may be missing.",
  ghNotSaved:"Not saved.",
  ghErr_auth:"GitHub rejected the token. It needs Contents: Read and write on this repository.",
  ghErr_network:"Could not reach GitHub. Check the internet connection.",
  ghErr_conflict:"Someone else saved at the same moment. Make the change again.",
  ghErr_api:"GitHub returned an error. Try again in a moment."
});
Object.assign(UI.sc,{
  ghTitle:"为所有人保存 (GitHub 令牌)",
  ghHelp:"修改会保存到网站的 GitHub 仓库，所有访客都能看到，新基金也会在那里自动翻译。这需要一个 GitHub 令牌。<br><br><b>创建方法：</b>在 GitHub 打开 Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token。Repository access 选择 <b>Only select repositories → fund-pitch</b>，Permissions 中将 <b>Contents 设为 Read and write</b>。将令牌粘贴到下方。令牌仅保存在此浏览器中，且只发送给 GitHub。",
  ghLabel:"GitHub 令牌",ghSave:"保存令牌",ghRemove:"移除令牌",
  ghTokenSaved:"此浏览器已保存令牌，您的修改将为所有人保存。",
  ghTokenNone:"尚未保存令牌。可以浏览，但无法保存修改。",
  ghTokenOk:"令牌有效，您的修改将为所有人保存。",
  ghNeedToken:"修改基金前，请先保存 GitHub 令牌：点击“+ 新增基金”，展开“为所有人保存”。",
  ghNeedTokenHere:"请先在下方“为所有人保存”中保存 GitHub 令牌。",
  ghSaving:"正在为所有人保存…",
  ghSaved:"已保存。网站重新发布后其他访客即可看到，通常在几分钟内。",
  ghSavedTranslating:n=>`已保存。正在 GitHub 上翻译 ${n} 只基金，完成后本页会自动更新。`,
  ghTranslated:"翻译完成，基金现已提供 English、简体和繁體。",
  ghTranslateSlow:"翻译尚未完成。请打开 GitHub 仓库的 Actions 页面查看原因；可能缺少 ANTHROPIC_API_KEY 密钥。",
  ghNotSaved:"未保存。",
  ghErr_auth:"GitHub 拒绝了该令牌。它需要对本仓库具有 Contents: Read and write 权限。",
  ghErr_network:"无法连接 GitHub，请检查网络连接。",
  ghErr_conflict:"有人同时保存了修改，请重新操作一次。",
  ghErr_api:"GitHub 返回错误，请稍后再试。"
});
Object.assign(UI.tc,{
  ghTitle:"為所有人儲存 (GitHub 權杖)",
  ghHelp:"修改會儲存到網站的 GitHub 儲存庫，所有訪客都能看到，新基金也會在那裡自動翻譯。這需要一個 GitHub 權杖。<br><br><b>建立方法：</b>在 GitHub 開啟 Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token。Repository access 選擇 <b>Only select repositories → fund-pitch</b>，Permissions 中將 <b>Contents 設為 Read and write</b>。將權杖貼到下方。權杖僅儲存在此瀏覽器中，且只傳送給 GitHub。",
  ghLabel:"GitHub 權杖",ghSave:"儲存權杖",ghRemove:"移除權杖",
  ghTokenSaved:"此瀏覽器已儲存權杖，您的修改將為所有人儲存。",
  ghTokenNone:"尚未儲存權杖。可以瀏覽，但無法儲存修改。",
  ghTokenOk:"權杖有效，您的修改將為所有人儲存。",
  ghNeedToken:"修改基金前，請先儲存 GitHub 權杖：點擊「+ 新增基金」，展開「為所有人儲存」。",
  ghNeedTokenHere:"請先在下方「為所有人儲存」中儲存 GitHub 權杖。",
  ghSaving:"正在為所有人儲存…",
  ghSaved:"已儲存。網站重新發布後其他訪客即可看到，通常在幾分鐘內。",
  ghSavedTranslating:n=>`已儲存。正在 GitHub 上翻譯 ${n} 隻基金，完成後本頁會自動更新。`,
  ghTranslated:"翻譯完成，基金現已提供 English、简体和繁體。",
  ghTranslateSlow:"翻譯尚未完成。請開啟 GitHub 儲存庫的 Actions 頁面查看原因；可能缺少 ANTHROPIC_API_KEY 密鑰。",
  ghNotSaved:"未儲存。",
  ghErr_auth:"GitHub 拒絕了該權杖。它需要對本儲存庫具有 Contents: Read and write 權限。",
  ghErr_network:"無法連接 GitHub，請檢查網路連線。",
  ghErr_conflict:"有人同時儲存了修改，請重新操作一次。",
  ghErr_api:"GitHub 傳回錯誤，請稍後再試。"
});

/* ---------- Local server (server.py) ---------- */
Object.assign(UI.en,{
  locStatus:"Running on this computer: changes are saved to data/funds.json here, and nobody else sees them until that file is pushed. Save a token to publish changes for everyone instead.",
  locTranslating:n=>`Translating ${n} fund${n===1?"":"s"} with Claude…`,
  locSaved:"Saved on this computer (data/funds.json). Commit and push that file to publish it for everyone.",
  locErr_nokey:"Not translated: ANTHROPIC_API_KEY is not set in the terminal that started server.py.",
  locErr_nosdk:"Not translated: the Anthropic SDK is missing. Run  pip install anthropic  and start server.py again.",
  locErr_key:"Not translated: the API key was rejected.",
  locErr_rate:"Not translated: the API rate limit was reached. Use Translate in View Fund in a minute.",
  locErr_network:"Not translated: the local server did not answer.",
  locErr_api:"Not translated: the API returned an error. The terminal running server.py shows the details.",
  locErr_save:"The local server could not write data/funds.json."
});
Object.assign(UI.sc,{
  locStatus:"正在本机运行：修改保存到本机的 data/funds.json，推送该文件之前其他人看不到。如需直接为所有人发布，请保存令牌。",
  locTranslating:n=>`正在使用 Claude 翻译 ${n} 只基金…`,
  locSaved:"已保存到本机 (data/funds.json)。提交并推送该文件后即可为所有人发布。",
  locErr_nokey:"未翻译：启动 server.py 的终端中未设置 ANTHROPIC_API_KEY。",
  locErr_nosdk:"未翻译：缺少 Anthropic SDK。请运行  pip install anthropic  后重新启动 server.py。",
  locErr_key:"未翻译：API 密钥被拒绝。",
  locErr_rate:"未翻译：已达到 API 速率上限。请稍后在“查看详情”中点击“翻译”。",
  locErr_network:"未翻译：本机服务器没有响应。",
  locErr_api:"未翻译：API 返回错误。运行 server.py 的终端会显示详情。",
  locErr_save:"本机服务器无法写入 data/funds.json。"
});
Object.assign(UI.tc,{
  locStatus:"正在本機執行：修改儲存到本機的 data/funds.json，推送該檔案之前其他人看不到。如需直接為所有人發布，請儲存權杖。",
  locTranslating:n=>`正在使用 Claude 翻譯 ${n} 隻基金…`,
  locSaved:"已儲存到本機 (data/funds.json)。提交並推送該檔案後即可為所有人發布。",
  locErr_nokey:"未翻譯：啟動 server.py 的終端機中未設定 ANTHROPIC_API_KEY。",
  locErr_nosdk:"未翻譯：缺少 Anthropic SDK。請執行  pip install anthropic  後重新啟動 server.py。",
  locErr_key:"未翻譯：API 金鑰被拒絕。",
  locErr_rate:"未翻譯：已達到 API 速率上限。請稍後在「查看詳情」中點擊「翻譯」。",
  locErr_network:"未翻譯：本機伺服器沒有回應。",
  locErr_api:"未翻譯：API 傳回錯誤。執行 server.py 的終端機會顯示詳情。",
  locErr_save:"本機伺服器無法寫入 data/funds.json。"
});

/* ---------- Drag to reorder ---------- */
UI.en.reorder="Drag to reorder"; UI.sc.reorder="拖动调整顺序"; UI.tc.reorder="拖動調整順序";

/* shown when the site runs on this computer through a plain file server, which cannot save anything */
UI.en.locNeedServer="This site was not started with server.py, so changes cannot be saved on this computer. Stop the current server and run  python server.py  in the project folder, then reload. (Or save a GitHub token to save changes for everyone.)";
UI.sc.locNeedServer="本站不是通过 server.py 启动的，因此无法在本机保存修改。请停止当前服务器，在项目文件夹中运行  python server.py ，然后刷新页面。(或保存 GitHub 令牌，为所有人保存修改。)";
UI.tc.locNeedServer="本站不是透過 server.py 啟動的，因此無法在本機儲存修改。請停止目前的伺服器，在專案資料夾中執行  python server.py ，然後重新整理頁面。(或儲存 GitHub 權杖，為所有人儲存修改。)";

/* clearer labels for the two inception fields in the Edit Fund form */
UI.en.efInception="Inception month (sets the year on the card)";  UI.en.efInceptionText="Inception note (extra detail in View Fund, optional)";
UI.sc.efInception="成立月份 (决定卡片上的年份)";                      UI.sc.efInceptionText="成立说明 (显示在详情中的补充文字，选填)";
UI.tc.efInception="成立月份 (決定卡片上的年份)";                      UI.tc.efInceptionText="成立說明 (顯示在詳情中的補充文字，選填)";

/* the hide list is now chosen by Claude when a fund is translated */
UI.en.imHide="Words hidden from investors (a first guess; Claude decides the final list when the fund is translated)";
UI.sc.imHide="对投资者隐藏的词 (初步建议；翻译基金时由 Claude 决定最终列表)";
UI.tc.imHide="對投資者隱藏的詞 (初步建議；翻譯基金時由 Claude 決定最終列表)";

/* the site opens as the investor view; signing in is for admins */
Object.assign(UI.en,{loginBtn:"Admin Login",loginTitle:"Admin Login",loginSub:"Sign in to add, edit and arrange funds.",liqLabel:"Liquidity",
  restoreConfirm:"Undo every edit and deletion of the original funds and strategies? Funds and strategies you added are kept."});
Object.assign(UI.sc,{loginBtn:"管理员登录",loginTitle:"管理员登录",loginSub:"登录后可新增、编辑及排列基金。",liqLabel:"流动性",
  restoreConfirm:"撤销对原始基金及策略的所有修改和删除？您新增的基金和策略将保留。"});
Object.assign(UI.tc,{loginBtn:"管理員登入",loginTitle:"管理員登入",loginSub:"登入後可新增、編輯及排列基金。",liqLabel:"流動性",
  restoreConfirm:"撤銷對原始基金及策略的所有修改和刪除？您新增的基金和策略將保留。"});

/* cover-page numbers can be edited by an admin */
UI.en.statEdit="Click to edit. Enter saves, Esc cancels.";
UI.sc.statEdit="点击即可编辑。按 Enter 保存，按 Esc 取消。";
UI.tc.statEdit="點擊即可編輯。按 Enter 儲存，按 Esc 取消。";
