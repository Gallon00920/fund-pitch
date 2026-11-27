/* ---------- UI strings ---------- */
const UI = {
  en:{brandSub:"",navAbout:"About",navFunds:"Funds",navDisclosure:"Disclosure",
    heroEyebrow:"Curated Credit Platform",
    heroTitle:"<b>Institutional credit,</b><br>selected with discipline.",
    heroBody:"A focused shelf of liquid and semi-liquid strategies, chosen through our manager research process for durable income, drawdown control and transparent liquidity terms.",
    stPipeline:"Funds",stGPs:"GPs Covered",stCategories:"Strategy Categories",stStrategies:"Featured Strategies",stAum:"Combined Fund AUM",stLiq:"Liquidity Profiles",stTrack:"Longest Track Record",
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
    
    division:"",yrs:n=>n+" yrs",
    disclaimer:"For professional investors only. Not an offer or solicitation. Past performance is not indicative of future results. Private funds are subject to lock-ups, gates and redemption restrictions."},
  sc:{brandSub:"",navAbout:"关于我们",navFunds:"基金",navDisclosure:"重要声明",
    heroEyebrow:"精选信贷平台",
    heroTitle:"<b>机构级信贷，</b><br>以严谨标准甄选。",
    heroBody:"一组精选的流动性与半流动性策略，经我们的管理人研究流程筛选，注重稳健收益、回撤控制与透明的流动性条款。",
    stPipeline:"只基金",stGPs:"覆盖GP数量",stCategories:"大类投资策略",stStrategies:"精选策略",stAum:"基金规模合计",stLiq:"流动性类别",stTrack:"最长业绩记录",
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
    
    division:"",yrs:n=>n+"年",
    disclaimer:"仅供专业投资者参考，不构成任何要约或要约邀请。过往业绩不代表未来表现。私募基金投资受锁定期、赎回闸门及其他赎回限制约束。"},
  tc:{brandSub:"",navAbout:"關於我們",navFunds:"基金",navDisclosure:"重要聲明",
    heroEyebrow:"精選信貸平台",
    heroTitle:"<b>機構級信貸，</b><br>以嚴謹標準甄選。",
    heroBody:"一組精選的流動性與半流動性策略，經我們的管理人研究流程篩選，注重穩健收益、回撤控制與透明的流動性條款。",
    stPipeline:"隻基金",stGPs:"覆蓋GP數量",stCategories:"大類投資策略",stStrategies:"精選策略",stAum:"基金規模合計",stLiq:"流動性類別",stTrack:"最長業績記錄",
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
    
    division:"",yrs:n=>n+"年",
    disclaimer:"僅供專業投資者參考，不構成任何要約或要約邀請。過往業績不代表未來表現。私募基金投資受鎖定期、贖回閘門及其他贖回限制約束。"}
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
  confirmDeleteBuiltIn:"Delete this fund from the site? This cannot be undone on the site."
});
Object.assign(UI.sc,{
  edit:"编辑基金",del:"删除基金",efTitle:"编辑基金",efSave:"保存修改",
  efInception:"成立月份",efInceptionText:"成立说明 (选填)",efAum:"基金规模 (十亿美元)",efAumText:"规模说明 (选填)",
  efTarget:"目标回报 (选填)",efReturns:"各期间回报",
  efReturnsHelp:"每行一个期间。完整年度：2024: 12.5    自6月起的部分年度：2022 from 6: 15.62    年初至10月：2026 YTD 10: 4.78",
  efNotes:"业绩记录备注 (每行一条，选填)",efDd:"回撤 / 损失说明 (选填)",efLiqFull:"流动性条款 (完整，选填)",efNote:"来源备注 (仅管理员可见，选填)",
  efErrRequired:"基金名称和策略标签不能为空。",
  efErrReturns:"请检查回报：每行一个期间，例如  2024: 12.5 、 2022 from 6: 15.62  或  2026 YTD 10: 4.78 ，且每个期间只能出现一次。",
  confirmDeleteBuiltIn:"确定从网站删除此基金？此操作无法在网站上撤销。"
});
Object.assign(UI.tc,{
  edit:"編輯基金",del:"刪除基金",efTitle:"編輯基金",efSave:"儲存修改",
  efInception:"成立月份",efInceptionText:"成立說明 (選填)",efAum:"基金規模 (十億美元)",efAumText:"規模說明 (選填)",
  efTarget:"目標回報 (選填)",efReturns:"各期間回報",
  efReturnsHelp:"每行一個期間。完整年度：2024: 12.5    自6月起的部分年度：2022 from 6: 15.62    年初至10月：2026 YTD 10: 4.78",
  efNotes:"業績記錄備註 (每行一條，選填)",efDd:"回撤 / 損失說明 (選填)",efLiqFull:"流動性條款 (完整，選填)",efNote:"來源備註 (僅管理員可見，選填)",
  efErrRequired:"基金名稱和策略標籤不能為空。",
  efErrReturns:"請檢查回報：每行一個期間，例如  2024: 12.5 、 2022 from 6: 15.62  或  2026 YTD 10: 4.78 ，且每個期間只能出現一次。",
  confirmDeleteBuiltIn:"確定從網站刪除此基金？此操作無法在網站上復原。"
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
Object.assign(UI.en,{loginBtn:"Admin Login",loginTitle:"Admin Login",loginSub:"Sign in to add, edit and arrange funds.",liqLabel:"Liquidity"});
Object.assign(UI.sc,{loginBtn:"管理员登录",loginTitle:"管理员登录",loginSub:"登录后可新增、编辑及排列基金。",liqLabel:"流动性"});
Object.assign(UI.tc,{loginBtn:"管理員登入",loginTitle:"管理員登入",loginSub:"登入後可新增、編輯及排列基金。",liqLabel:"流動性"});

/* cover-page numbers can be edited by an admin */
UI.en.statEdit="Click to edit. Enter saves, Esc cancels.";
UI.sc.statEdit="点击即可编辑。按 Enter 保存，按 Esc 取消。";
UI.tc.statEdit="點擊即可編輯。按 Enter 儲存，按 Esc 取消。";

/* monthly returns table read from a picture */
Object.assign(UI.en,{monthlyTitle:"Monthly Returns",monthlyOpen:"View table",monthlyDownload:"Download CSV",moYear:"Year",moTotal:"Total",
  imMonthly:"Monthly returns picture (optional)",moReading:"Claude is reading the table…",moWait:"A picture is still being read. Please wait a moment.",
  moDone:(n,a,b)=>`Table read: ${n} year${n===1?"":"s"}, ${a}${a===b?"":" to "+b}. Only the numbers are kept.`,
  moCheck:y=>`Check ${y} against the picture: the months do not add up to the year total.`,
  moRows:(n,a,b)=>`Table: ${n} year${n===1?"":"s"}, ${a}${a===b?"":" to "+b}.`,
  moHelp:"One year per line: the year, Jan to Dec, then the year total. Write - for an empty cell. Choose a picture to fill this box, then correct any figure here. Rows pasted from Excel work too.",
  moErrLine:y=>`Check the monthly table line starting with "${y}": it needs a year, 12 monthly figures and the year total, with - for an empty cell, and each year only once.`,moNone:"No monthly table yet.",moRemove:"Remove table",
  moDrop:"Drop a picture here, or click to choose",moDropHint:"A monthly returns table, or a share class table (fees and liquidity). Claude reads it and fills the matching box. PNG, JPEG, WebP or GIF under 4.5 MB; Ctrl+V pastes a screenshot.",moDropWhere:"Drop the picture on the fund it belongs to.",
  moErr_noserver:"Reading a picture needs the local server. Start server.py on your computer, add the picture there, then push.",
  moErr_nokey:"The local server has no Claude key. Set ANTHROPIC_API_KEY in its terminal and start it again.",
  moErr_nosdk:"The local server is missing the Anthropic SDK. Run: pip install anthropic",
  moErr_key:"Claude rejected the API key. Check the key in the server's terminal.",moErr_rate:"Claude is busy right now. Try again in a minute.",
  moErr_notable:"No monthly returns table or share class table was found in this picture.",moErr_big:"The picture is too large. Use one under 4.5 MB.",
  moErr_type:"Use a PNG, JPEG, WebP or GIF picture.",moErr_network:"The local server did not answer. Check that server.py is still running.",
  moErr_api:"The picture could not be read. Try again."});
Object.assign(UI.sc,{monthlyTitle:"月度回报",monthlyOpen:"查看表格",monthlyDownload:"下载 CSV",moYear:"年份",moTotal:"全年",
  imMonthly:"月度回报图片 (可选)",moReading:"Claude 正在读取表格…",moWait:"图片仍在读取中，请稍候。",
  moDone:(n,a,b)=>`已读取表格：${n} 个年度，${a}${a===b?"":" 至 "+b}。仅保留数字。`,
  moCheck:y=>`请对照图片核对 ${y}：各月回报与全年数字不一致。`,
  moRows:(n,a,b)=>`表格：${n} 个年度，${a}${a===b?"":" 至 "+b}。`,
  moHelp:"每行一个年度：年份、1月至12月、全年回报。空白单元格请写 - 。选择图片可自动填入，之后可在此修改任何数字，也可直接粘贴 Excel 行。",
  moErrLine:y=>`请检查月度表中以“${y}”开头的一行：需要年份、12 个月度数字和全年数字，空白单元格写 - ，且每个年份只能出现一次。`,moNone:"尚无月度回报表。",moRemove:"移除表格",
  moDrop:"将图片拖到此处，或点击选择",moDropHint:"月度回报表或份额类别表 (费用与流动性)。Claude 读取后填入对应的框。PNG、JPEG、WebP 或 GIF，4.5 MB 以下；可用 Ctrl+V 粘贴截图。",moDropWhere:"请将图片拖到对应的基金上。",
  moErr_noserver:"读取图片需要本地服务器。请在电脑上启动 server.py，在本地添加图片后再推送。",
  moErr_nokey:"本地服务器没有 Claude 密钥。请在其终端设置 ANTHROPIC_API_KEY 后重新启动。",
  moErr_nosdk:"本地服务器缺少 Anthropic SDK。请运行：pip install anthropic",
  moErr_key:"Claude 拒绝了该 API 密钥，请检查服务器终端中的密钥。",moErr_rate:"Claude 当前繁忙，请稍后再试。",
  moErr_notable:"图片中未找到月度回报表或份额类别表。",moErr_big:"图片过大，请使用 4.5 MB 以下的图片。",
  moErr_type:"请使用 PNG、JPEG、WebP 或 GIF 图片。",moErr_network:"本地服务器没有响应，请确认 server.py 仍在运行。",
  moErr_api:"无法读取图片，请重试。"});
Object.assign(UI.tc,{monthlyTitle:"月度回報",monthlyOpen:"查看表格",monthlyDownload:"下載 CSV",moYear:"年份",moTotal:"全年",
  imMonthly:"月度回報圖片 (可選)",moReading:"Claude 正在讀取表格…",moWait:"圖片仍在讀取中，請稍候。",
  moDone:(n,a,b)=>`已讀取表格：${n} 個年度，${a}${a===b?"":" 至 "+b}。僅保留數字。`,
  moCheck:y=>`請對照圖片核對 ${y}：各月回報與全年數字不一致。`,
  moRows:(n,a,b)=>`表格：${n} 個年度，${a}${a===b?"":" 至 "+b}。`,
  moHelp:"每行一個年度：年份、1月至12月、全年回報。空白儲存格請寫 - 。選擇圖片可自動填入，之後可在此修改任何數字，也可直接貼上 Excel 列。",
  moErrLine:y=>`請檢查月度表中以「${y}」開頭的一行：需要年份、12 個月度數字和全年數字，空白儲存格寫 - ，且每個年份只能出現一次。`,moNone:"尚無月度回報表。",moRemove:"移除表格",
  moDrop:"將圖片拖到此處，或點擊選擇",moDropHint:"月度回報表或份額類別表 (費用與流動性)。Claude 讀取後填入對應的框。PNG、JPEG、WebP 或 GIF，4.5 MB 以下；可用 Ctrl+V 貼上截圖。",moDropWhere:"請將圖片拖到對應的基金上。",
  moErr_noserver:"讀取圖片需要本機伺服器。請在電腦上啟動 server.py，在本機新增圖片後再推送。",
  moErr_nokey:"本機伺服器沒有 Claude 金鑰。請在其終端機設定 ANTHROPIC_API_KEY 後重新啟動。",
  moErr_nosdk:"本機伺服器缺少 Anthropic SDK。請執行：pip install anthropic",
  moErr_key:"Claude 拒絕了該 API 金鑰，請檢查伺服器終端機中的金鑰。",moErr_rate:"Claude 目前繁忙，請稍後再試。",
  moErr_notable:"圖片中未找到月度回報表或份額類別表。",moErr_big:"圖片過大，請使用 4.5 MB 以下的圖片。",
  moErr_type:"請使用 PNG、JPEG、WebP 或 GIF 圖片。",moErr_network:"本機伺服器沒有回應，請確認 server.py 仍在執行。",
  moErr_api:"無法讀取圖片，請重試。"});

/* share classes (fees and liquidity terms per class), and the shared picture box */
Object.assign(UI.en,{clHead:"Share Classes: Fees & Liquidity",picTitle:"Tables from a picture (optional)",moBoxTitle:"Monthly returns table (optional)",
  clTitle:"Share classes: fees and liquidity (optional)",
  clHelp:"Column titles on the first line, then one class per line, with | between the cells. Rows pasted from Excel work too. In View Fund this table replaces the liquidity terms text. Empty the box to remove the table.",
  clDone:n=>`Share class table read: ${n} row${n===1?"":"s"}. Check it below.`,clRows:(n,c)=>`Table: ${n} class${n===1?"":"es"}, ${c} columns.`,clNone:"No share class table yet.",
  clErrLine:x=>`Check the share class table line starting with "${x}": it needs a title line and at least one class, 2 to 10 cells per line separated by |, and no more cells than the title line.`});
Object.assign(UI.sc,{clHead:"份额类别：费用与流动性",picTitle:"从图片读取表格 (可选)",moBoxTitle:"月度回报表 (可选)",
  clTitle:"份额类别：费用与流动性 (可选)",
  clHelp:"第一行为列标题，其后每行一个类别，单元格之间用 | 分隔，也可直接粘贴 Excel 行。在“查看基金”中，此表格将取代流动性条款文字。清空此框即可移除表格。",
  clDone:n=>`已读取份额类别表：${n} 行，请在下方核对。`,clRows:(n,c)=>`表格：${n} 个类别，${c} 列。`,clNone:"尚无份额类别表。",
  clErrLine:x=>`请检查份额类别表中以“${x}”开头的一行：需要标题行和至少一个类别，每行 2 至 10 个单元格并以 | 分隔，且不能多于标题行的单元格数。`});
Object.assign(UI.tc,{clHead:"份額類別：費用與流動性",picTitle:"從圖片讀取表格 (可選)",moBoxTitle:"月度回報表 (可選)",
  clTitle:"份額類別：費用與流動性 (可選)",
  clHelp:"第一行為欄標題，其後每行一個類別，儲存格之間用 | 分隔，也可直接貼上 Excel 列。在「查看基金」中，此表格將取代流動性條款文字。清空此框即可移除表格。",
  clDone:n=>`已讀取份額類別表：${n} 行，請在下方核對。`,clRows:(n,c)=>`表格：${n} 個類別，${c} 欄。`,clNone:"尚無份額類別表。",
  clErrLine:x=>`請檢查份額類別表中以「${x}」開頭的一行：需要標題行和至少一個類別，每行 2 至 10 個儲存格並以 | 分隔，且不能多於標題行的儲存格數。`});

/* renaming a strategy tab */
Object.assign(UI.en,{stratRename:"Rename strategy",stratSave:"Save"});
Object.assign(UI.sc,{stratRename:"重命名策略",stratSave:"保存"});
Object.assign(UI.tc,{stratRename:"重新命名策略",stratSave:"儲存"});

/* a fee table that sits above the liquidity text instead of replacing it */
Object.assign(UI.en,{clHeadFees:"Fee Schedule",clKeep:"This table holds fees only: keep the liquidity terms text under it"});
Object.assign(UI.sc,{clHeadFees:"费用结构",clKeep:"此表仅含费用：在表格下方保留流动性条款文字"});
Object.assign(UI.tc,{clHeadFees:"費用結構",clKeep:"此表僅含費用：在表格下方保留流動性條款文字"});

/* two categories, each listing its strategies */
Object.assign(UI.en,{grpLiquid:"Liquid",grpClosed:"Closed-End / Semi-Liquid",subDaily:"Daily",subMonthly:"Monthly",subQuarterly:"Quarterly",grpEmpty:"No strategies yet"});
Object.assign(UI.sc,{grpLiquid:"流动性基金",grpClosed:"封闭式 / 半流动性",subDaily:"每日",subMonthly:"每月",subQuarterly:"每季度",grpEmpty:"暂无策略"});
Object.assign(UI.tc,{grpLiquid:"流動性基金",grpClosed:"封閉式 / 半流動性",subDaily:"每日",subMonthly:"每月",subQuarterly:"每季度",grpEmpty:"暫無策略"});
UI.en.noFunds="No funds in this strategy yet.";UI.sc.noFunds="此策略暂无基金。";UI.tc.noFunds="此策略暫無基金。";

/* the Focus List: highlighted funds, shown as the first tab */
Object.assign(UI.en,{focusTab:"Focus List",focusAdd:"Add to Focus List",focusRemove:"Remove from Focus List",descFocus:"Funds we are highlighting at the moment, drawn from the strategies alongside."});
Object.assign(UI.sc,{focusTab:"重点推荐",focusAdd:"加入重点推荐",focusRemove:"移出重点推荐",descFocus:"当前重点推荐的基金，选自各策略。"});
Object.assign(UI.tc,{focusTab:"重點推薦",focusAdd:"加入重點推薦",focusRemove:"移出重點推薦",descFocus:"當前重點推薦的基金，選自各策略。"});

/* My Focus List is each visitor's own; the admin star marks the team's top picks */
Object.assign(UI.en,{focusTab:"My Focus List",descFocus:"Funds you have saved. Your list is kept in this browser only.",
  save:"Focus List",saved:"In Focus List",saveAdd:"Add to My Focus List",saveRemove:"Remove from My Focus List",
  pickAdd:"Mark as recommended",pickRemove:"Clear recommendation",pickLabel:"Recommended",pickNote:"Recommended: a fund our team rates most highly."});
Object.assign(UI.sc,{focusTab:"我的关注",descFocus:"您已收藏的基金。此列表仅保存在本浏览器中。",
  save:"加入关注",saved:"已关注",saveAdd:"加入我的关注",saveRemove:"移出我的关注",
  pickAdd:"标记为推荐",pickRemove:"取消推荐",pickLabel:"推荐",pickNote:"推荐：我们团队最看好的基金。"});
Object.assign(UI.tc,{focusTab:"我的關注",descFocus:"您已收藏的基金。此列表僅保存在本瀏覽器中。",
  save:"加入關注",saved:"已關注",saveAdd:"加入我的關注",saveRemove:"移出我的關注",
  pickAdd:"標記為推薦",pickRemove:"取消推薦",pickLabel:"推薦",pickNote:"推薦：我們團隊最看好的基金。"});
/* new funds: earlier funds' net IRR by vintage (card chart, View Fund chart and table, Edit Fund box) */
Object.assign(UI.en,{vintTitle:"Net IRR by vintage",vintTable:"Earlier funds",vintKey:"Pale: investing",vintFund:"Fund",vintRetHead:"Net IRR / multiple",
  vintHead:"Earlier Funds by Vintage",vintCap:"Net IRR of the manager's earlier funds in this series, by the year each started. This fund is new and has no returns of its own yet. Pale bars are funds still investing, so their figures are not final.",
  vintYear:"Vintage",vintIrr:"Net IRR",vintX:"Net multiple",vintLiveTag:"investing",
  efVint:"Earlier funds by vintage (new funds; one per line, optional)",
  efVintHelp:"Fund, vintage: net IRR / multiple / DPI, then \"investing\" if not final.  For example:  Kreos IV, 2012: 11.1 / 1.32x / DPI 1.23x    Kreos VII, 2022: 17.0 / 1.31x investing",
  efErrVint:n=>`Check line ${n} of the earlier funds: write it like  Kreos IV, 2012: 11.1 / 1.32x  (the multiple, DPI and "investing" are optional).`});
Object.assign(UI.sc,{vintTitle:"各期基金净 IRR",vintTable:"前序基金",vintKey:"浅色：投资中",vintFund:"基金",vintRetHead:"净 IRR / 倍数",
  vintHead:"前序基金 (按成立年份)",vintCap:"管理人同系列前序基金的净 IRR，按各基金成立年份排列。本基金为新发基金，尚无自身业绩。浅色柱为仍在投资期的基金，数据尚非最终结果。",
  vintYear:"成立年份",vintIrr:"净 IRR",vintX:"净倍数",vintLiveTag:"投资中",
  efVint:"前序基金 (新发基金适用；每行一只，选填)",
  efVintHelp:"基金, 年份: 净 IRR / 倍数 / DPI，尚未结束的加 \"investing\"。例如：  Kreos IV, 2012: 11.1 / 1.32x / DPI 1.23x    Kreos VII, 2022: 17.0 / 1.31x investing",
  efErrVint:n=>`请检查前序基金第 ${n} 行：格式如  Kreos IV, 2012: 11.1 / 1.32x  (倍数、DPI 及 investing 可省略)。`});
Object.assign(UI.tc,{vintTitle:"各期基金淨 IRR",vintTable:"前序基金",vintKey:"淺色：投資中",vintFund:"基金",vintRetHead:"淨 IRR / 倍數",
  vintHead:"前序基金 (按成立年份)",vintCap:"管理人同系列前序基金的淨 IRR，按各基金成立年份排列。本基金為新發基金，尚無自身績效。淺色柱為仍在投資期的基金，數據尚非最終結果。",
  vintYear:"成立年份",vintIrr:"淨 IRR",vintX:"淨倍數",vintLiveTag:"投資中",
  efVint:"前序基金 (新發基金適用；每行一隻，選填)",
  efVintHelp:"基金, 年份: 淨 IRR / 倍數 / DPI，尚未結束的加 \"investing\"。例如：  Kreos IV, 2012: 11.1 / 1.32x / DPI 1.23x    Kreos VII, 2022: 17.0 / 1.31x investing",
  efErrVint:n=>`請檢查前序基金第 ${n} 行：格式如  Kreos IV, 2012: 11.1 / 1.32x  (倍數、DPI 及 investing 可省略)。`});
/* a fund with its own record can still list the strategy's other funds by vintage (View Fund) */
Object.assign(UI.en,{vintHeadSib:"Other Funds in the Strategy",vintCapSib:"Net IRR of the manager's other funds running the same strategy, by the year each started. They are separate funds, shown for context alongside this fund's own returns. Pale bars are funds still investing, so their figures are not final."});
Object.assign(UI.sc,{vintHeadSib:"同策略其他基金",vintCapSib:"管理人运行同一策略的其他基金的净 IRR，按各基金成立年份排列。它们是独立的基金，与本基金自身业绩一并列示供参考。浅色柱为仍在投资期的基金，数据尚非最终结果。"});
Object.assign(UI.tc,{vintHeadSib:"同策略其他基金",vintCapSib:"管理人運行同一策略的其他基金的淨 IRR，按各基金成立年份排列。它們是獨立的基金，與本基金自身績效一併列示供參考。淺色柱為仍在投資期的基金，數據尚非最終結果。"});
