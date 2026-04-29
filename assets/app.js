// ========================================
// Лаборатория Ремонта — логика каталога
// ========================================

// ===== Auto-detection dictionaries (defaults) =====
const DEFAULT_PART_TYPES = {
    'Помпа': ['помпа', 'насос', 'pump', 'ulka', 'jypc'],
    'Двигатель': ['двигатель', 'мотор', 'motor', 'engine'],
    'Аккумулятор': ['аккумулятор', 'аккмулятор', 'батарея', 'battery', 'акб', 'li-pol', 'li-ion'],
    'Экран': ['экран', 'дисплей', 'display', 'lcd', 'oled', 'screen'],
    'Плата': ['плата', 'модуль', 'board', 'igbt', 'контроллер', 'pcb'],
    'Шлейф': ['шлейф', 'flex', 'кабель', 'cable'],
    'Корпус': ['корпус', 'крышка', 'рамка', 'case', 'housing'],
    'Камера': ['камера', 'camera', 'объектив'],
    'Динамик': ['динамик', 'спикер', 'speaker', 'звонок', 'buzzer'],
    'Микрофон': ['микрофон', 'microphone', 'mic'],
    'Кнопка': ['кнопка', 'button', 'клавиша'],
    'Щётка': ['щетка', 'щётка', 'brush'],
    'Фильтр': ['фильтр', 'filter'],
    'Стекло': ['стекло', 'glass', 'защитное'],
    'Разъём': ['разъем', 'разъём', 'коннектор', 'connector', 'jack'],
    'Тачскрин': ['тачскрин', 'тач', 'touch', 'сенсор'],
    'Зарядка': ['зарядка', 'зарядное', 'charger', 'адаптер'],
    'Клапан': ['клапан', 'valve'],
    'Бойлер': ['бойлер', 'boiler'],
    'Уплотнитель': ['уплотнитель', 'манжета', 'прокладка', 'gasket', 'seal']
};

const DEFAULT_BRANDS = {
    'AEG': ['aeg'],
    'AMWAY': ['amway'],
    'APC': ['apc'],
    'Acer': ['acer'],
    'Admiral': ['admiral'],
    'Alliance': ['alliance'],
    'Allis-Chalmers': ['allis-chalmers'],
    'Allison': ['allison'],
    'Amana': ['amana'],
    'Angelica': ['angelica'],
    'Apple': ['apple', 'iphone', 'ipad', 'macbook', 'imac', 'airpods'],
    'Ariete': ['ariete'],
    'Ariston': ['ariston'],
    'Asus': ['asus'],
    'Autosan': ['autosan'],
    'Avery': ['avery'],
    'BBK': ['bbk'],
    'BORK': ['bork'],
    'Ballu': ['ballu'],
    'Bauknecht': ['bauknecht'],
    'Belaz': ['belaz'],
    'Bendix': ['bendix'],
    'Bestway': ['bestway'],
    'Bissel': ['bissel', 'bissell'],
    'Black+Decker': ['black decker', 'black+decker'],
    'Boneco': ['boneco'],
    'Bort': ['bort'],
    'Bosch': ['bosch'],
    'Bose': ['bose'],
    'Braun': ['braun'],
    'Brayer': ['brayer'],
    'Bucher': ['bucher'],
    'CUCKOO': ['cuckoo'],
    'Candy': ['candy'],
    'Carrera': ['carrera'],
    'Case': ['case'],
    'Caso': ['caso'],
    'Caterpillar': ['caterpillar'],
    'Cissell': ['cissell'],
    'Claas': ['claas'],
    'Clark': ['clark'],
    'Cleveland': ['cleveland'],
    'Cockshutt': ['cockshutt'],
    'Crosley': ['crosley'],
    'DAB': ['dab'],
    'DEXP': ['dexp'],
    'Daewoo': ['daewoo'],
    'Dana': ['dana'],
    'Dauken': ['dauken'],
    'David Brown': ['david brown'],
    'DeLonghi': ['delonghi'],
    'DeWALT': ['dewalt'],
    'Deerma': ['deerma'],
    'Dell': ['dell'],
    'Deutz': ['deutz'],
    'Diebold': ['diebold'],
    'Domel': ['domel'],
    'Dreame': ['dreame'],
    'Duet': ['duet'],
    'Dyson': ['dyson'],
    'ESPA': ['espa'],
    'Eaton': ['eaton'],
    'Einhell': ['einhell'],
    'Electrolux': ['electrolux'],
    'Endever': ['endever'],
    'Ensemble': ['ensemble'],
    'Fendt': ['fendt'],
    'Ferguson': ['ferguson'],
    'Fordson': ['fordson'],
    'Frigidaire': ['frigidaire'],
    'Fuller': ['fuller'],
    'GE': ['ge'],
    'Gardena': ['gardena'],
    'Garlyn': ['garlyn'],
    'Gaz': ['gaz'],
    'General Electric': ['general electric'],
    'Gibson': ['gibson'],
    'Gleaner': ['gleaner'],
    'Gorenje': ['gorenje'],
    'Greenwald': ['greenwald'],
    'Grundfos': ['grundfos', 'грундфос'],
    'HOBOT': ['hobot'],
    'HP': ['hp'],
    'Haier': ['haier'],
    'Hamilton Beach': ['hamilton beach'],
    'Harman/Kardon': ['harman', 'kardon'],
    'Hilti': ['hilti'],
    'Hisense': ['hisense'],
    'Hitachi': ['hitachi'],
    'Hoffman': ['hoffman'],
    'Honda': ['honda'],
    'Hoover': ['hoover'],
    'Hotpoint': ['hotpoint'],
    'Huawei': ['huawei', 'honor'],
    'Huebsch': ['huebsch'],
    'Hurlimann': ['hurlimann'],
    'Hyster': ['hyster'],
    'Hyundai': ['hyundai'],
    'Ikarus': ['ikarus'],
    'Indesit': ['indesit'],
    'Intex': ['intex'],
    'Ipso': ['ipso'],
    'JBL': ['jbl'],
    'Jelcz': ['jelcz'],
    'Jenn-Air': ['jenn-air'],
    'John Deere': ['john deere'],
    'Jura': ['jura'],
    'Kalamazoo': ['kalamazoo'],
    'Kamaz': ['kamaz'],
    'Karcher': ['karcher', 'керхер'],
    'Kelvinator': ['kelvinator'],
    'Kenwood': ['kenwood'],
    'KitchenAid': ['kitchenaid', 'китченейд'],
    'Kitfort': ['kitfort'],
    'Krups': ['krups'],
    'Kubota': ['kubota'],
    'LG': ['lg'],
    'Lada': ['lada'],
    'Lamborghini': ['lamborghini'],
    'Laundromat': ['laundromat'],
    'Laurastar': ['laurastar'],
    'Leader': ['leader'],
    'Lenovo': ['lenovo'],
    'Leyland': ['leyland'],
    'LiAZ': ['liaz'],
    'MZKT': ['mzkt'],
    'Magirus-Deutz': ['magirus-deutz'],
    'Makita': ['makita'],
    'Marina': ['marina'],
    'Marshall': ['marshall'],
    'Massey Ferguson': ['massey ferguson'],
    'Maytag': ['maytag'],
    'Melitta': ['melitta'],
    'Metabo': ['metabo'],
    'Midea': ['midea'],
    'Miele': ['miele'],
    'MikroTik': ['mikrotik'],
    'Minneapolis-Moline': ['minneapolis-moline'],
    'Mitsubishi': ['mitsubishi'],
    'Moskvich': ['moskvich'],
    'Motorola': ['motorola'],
    'Moulinex': ['moulinex'],
    'National': ['national'],
    'Nespresso': ['nespresso'],
    'Nissan': ['nissan'],
    'Nocchi': ['nocchi'],
    'Nokia': ['nokia'],
    'Norge': ['norge'],
    'Nuffield': ['nuffield'],
    'Nysa': ['nysa'],
    'OKAMI': ['okami'],
    'Oliver': ['oliver'],
    'PAZ': ['paz'],
    'Panasonic': ['panasonic'],
    'Pedrollo': ['pedrollo'],
    'Perkins': ['perkins'],
    'Philco': ['philco'],
    'Philips': ['philips', 'aquatrio'],
    'Polaris': ['polaris'],
    'Powercom': ['powercom'],
    'Premier': ['premier'],
    'Privileg': ['privileg'],
    'Pullman': ['pullman'],
    'Rainbow': ['rainbow'],
    'Redmond': ['redmond'],
    'Roborock': ['roborock'],
    'Robot Coupe': ['robot coupe'],
    'Rockwell': ['rockwell'],
    'Roidmi': ['roidmi'],
    'Rommelsbacher': ['rommelsbacher'],
    'Roper': ['roper'],
    'Rowenta': ['rowenta'],
    'Saeco': ['saeco'],
    'Same': ['same'],
    'Samsung': ['samsung', 'galaxy'],
    'San': ['san'],
    'Sharp': ['sharp'],
    'Siemens': ['siemens'],
    'Smeg': ['smeg'],
    'Sony': ['sony', 'playstation'],
    'Speed Queen': ['speed queen'],
    'Spicer': ['spicer'],
    'Stadler Form': ['stadler'],
    'Star': ['star'],
    'Steyr': ['steyr'],
    'Synology': ['synology'],
    'Tappan': ['tappan'],
    'Tefal': ['tefal'],
    'Thomas': ['thomas'],
    'Toshiba': ['toshiba'],
    'Toyota': ['toyota'],
    'UAZ': ['uaz'],
    'URAL': ['ural'],
    'Ulka': ['ulka'],
    'Unimac': ['unimac'],
    'Ursus': ['ursus'],
    'VITEK': ['vitek'],
    'VORWERK': ['vorwerk'],
    'Vitamix': ['vitamix'],
    'Volga': ['volga'],
    'WMF': ['wmf'],
    'Weissgauff': ['weissgauff'],
    'Westing house': ['westing house'],
    'Westinghouse': ['westinghouse'],
    'Whirlpool': ['whirlpool'],
    'White': ['white'],
    'Wilo': ['wilo'],
    'Xiaomi': ['xiaomi', 'redmi', 'poco', 'mijia'],
    'Yale': ['yale'],
    'ZIL': ['zil'],
    'Zanussi': ['zanussi'],
    'Zaporozhets': ['zaporozhets'],
    'Zelmer': ['zelmer'],
    'Zepter': ['zepter'],
    'Zetor': ['zetor'],
    'Zwilling': ['zwilling'],
    'iLIFE': ['ilife'],
    'iRobot': ['irobot', 'roomba'],
    'Вихрь': ['вихрь'],
    'Гном': ['гном'],
    'Джилекс': ['джилекс', 'джамбо'],
    'Зубр': ['зубр'],
    'Ресанта': ['ресанта'],
    'Яндекс': ['яндекс']
};

const DEFAULT_APPLIANCES = {
    'Телефон': ['iphone', 'phone', 'телефон', 'смартфон', 'galaxy', 'redmi', 'pixel'],
    'Планшет': ['ipad', 'планшет', 'tablet'],
    'Ноутбук': ['macbook', 'ноутбук', 'laptop', 'notebook'],
    'Пылесос': ['пылесос', 'vacuum', 'vaccum', 'aquatrio'],
    'Кофемашина': ['кофе', 'coffee', 'espresso', 'эспрессо', 'ulka', 'jypc', 'saeco', 'delonghi', 'jura', 'nespresso'],
    'Бритва': ['бритв', 'shaver', 'wes8163'],
    'Стиральная машина': ['стиральн', 'стиралка', 'washing', 'washer'],
    'Холодильник': ['холодильник', 'fridge'],
    'Микроволновка': ['микроволнов', 'microwave', 'свч'],
    'Блендер': ['блендер', 'blender'],
    'Чайник': ['чайник', 'kettle'],
    'Утюг': ['утюг', 'iron'],
    'Фен': ['фен', 'hairdryer'],
    'ИБП': ['ибп', 'ups', 'бесперебойн']
};

// Brand → Model mapping (from RoApp database)
const BRAND_MODELS = {
    'Acer': ["D17W3","DNX1522","ES1-511","N17C1","V5WE2","VG272U"],
    'AEG': ["BS14G2","BS18G4","BSS 4808","BST18blx2"],
    'AMWAY': ["211450319HAAC","2118700563JAAC","211890088HAAC","213090228HAAC","213120114HAAC","2908BAV","iCOOK Blender 121639"],
    'APC': ["BV1000I-GR","BVX1200LI-GR","BVX2200LI","BVX900LI-GR","Back-UPS 650","Back-UPS 700","Back-UPS 800","Back-UPS 950","Back-UPS ES 525","Back-UPS ES 700","BackUPS Pro 900","Smart UPS 1000","Smart UPS 1500","Smart-UPS 1000"],
    'Ariete': ["1452","2793","585"],
    'Asus': ["AC3100","K3500P","MX27U","S400C","TP412F","UX305L","VivoBook S15","X545F","X554L"],
    'Ballu': ["BEC/ATI-1503","BEC/EZER-1500","BHP-M-15","ONEAIR ASP-100","UCC-260 C"],
    'BBK': ["20MWG-740M/s","40LEM-1043/FTS2C","DV312SI","DV426SI","MP072S"],
    'Bestway': ["58383","58499"],
    'Bissel': ["17132"],
    'Black+Decker': ["BDCDD12 H1","BDV158","KA88","KC9039","KD574CRE"],
    'Boneco': ["2055D","U350","U700","U7135","W1355A","W2055D"],
    'BORK': ["A802","B804","C532","C533","C701","C730BK","C801","C803","C804","C807","CG700","G700","G800","G801","H701","I510","I603","I780","J500","J700","J701","K515","K700","K703","K780","K800","K810","M401","M500","Q710","Q780","S610","T700","T703","T781","T800","U800","V503","V510","V702","V705","V711","W511","X500","Z610"],
    'Bort': ["BDR 2500 RR","BHD-800N"],
    'Bosch': ["BCH3K255","BFL523MW3","BGS42230/06","Benvenuto B60","GBH 2-24 DSR","GBH 2-26 DFR","GBH 2-28 F","GSR 120-LI","GSR 180-Li","MCM4200/01","MUM 4505","MUM 86","PSR 14 4 LI","TDS 4580/01","TDS 6030/03","TWK8611/02","VCAS010V25"],
    'Braun': ["CareStyle 5","CareStyle 7","CareStyle 7 pro","IS3022WH","IS5042WH","IS5145BK","IS5155WH","IS7043/WH","IS7143WH","IS7155WH","IS7156BK","IS7262GY","IS7286BK","S9 Pro","SERIES 7","TexStyle 5"],
    'Carrera': ["655","CRC 657","CRD671","CRM564"],
    'Caso': ["HW550","VAC 480"],
    'CUCKOO': ["CMC-HE1055F"],
    'DAB': ["ACTIVE J 82 M","CP 50/2500","DIVERTRON 1000 M","DIVERTRON 1200 M","E.SYBOX MINI 3","FEKA VS 750 M","TF 110 S1","Vertynova 400M","esybox","jet 132 m"],
    'Daewoo': ["DAS 4000/24","KOR-4115A","KOR-637RA"],
    'Deerma': ["DEM-F950W","DEM-VX96W","DEM-ZQ610"],
    'Dell': ["P88G","U2312"],
    'DeLonghi': ["EC685 RX-4","ECAM 22.110.b","ECAM 22.110.sb","ECAM 290 31","ECAM350.15.B","EN 110","EN 500W","EN 510","EN 520","EN 80","EN 85","EN85L","ESAM 2200.S","ESAM 2600","ESAM3000 B","MAGNIFICA","VVX2450DualVap","XLR18LM"],
    'DeWALT': ["D25144","DCD701","DCD709","DCD796","DCF887"],
    'DEXP': ["DH-30KGSO","Mars"],
    'Dreame': ["BOT Z10 Pro","D9","H12Core","H13 Pro","RLD33GA","RLD34GA","RLS5-WH0","RLS6L","RLX41CE","VVN4","VVN5"],
    'Dyson': ["DC23","DC33C","DC37","DC45","DC52","HD01","HD03","HD07","HS01","HS05","HS08","HS09","SV10","SV11","SV12","SV14","SV15","SV17","SV20","SV21","SV22","SV23","SV25","SV27","SV28","SV47","V11","V6","V8"],
    'Einhell': ["BHS66","NLW 180"],
    'Electrolux': ["EAP-2050D","ECH/AG-2000","EHU-3710D","EHU-3810D","PC91-4MG","Pure Q9","Z8870","ZB2901"],
    'Endever': ["Costa 1063","Odyssey Q-806","SIGMA 101"],
    'ESPA': ["ASPRI 15 5M","ASPRI 25 4M","ASPRI 25 5M","ASPRI15 4M","ASPRI35 4MN","Aspri 35 5M N","NEPTUN FL100 90M","PRISMA25 5M","silen 100m","silen 30m"],
    'Gardena': ["3000/4","3000/4 ECO","3600/4","4000/4","4000/5","4000/5 eco","4000/5E","5000/5","5000/5 ECO","6000"],
    'Garlyn': ["GST-08 pro","K-110","L1000"],
    'Gorenje': ["BM1400E","GMO-25 DGE","MO17E1BH","SVC216FS"],
    'Grundfos': ["JP 5","JP 6","JP Basic 2 PT","MQ3-35","MQ3-35 B","MQ3-45","MQ3-45 B","SB3-45 A","SBA3-35 A","SBA3-45 A","SCALA 2 3-45","SOLOLIFT 2 C-3","SOLOLIFT2 C3","SPO 3-65 A","Scala 1 3-45","Unilift CC7-A1","UPS 25-40","UPS 25-60","UPS 32-80"],
    'Haier': ["HB-600","HG 700","HI-700","HSR Pro+","HVC150","HVC250"],
    'Hamilton Beach': ["HBB908R-CE","HBH950-CE"],
    'Harman/Kardon': ["Citation ONE","Towers"],
    'Hilti': ["DD 160"],
    'Hitachi': ["CV-SF80","HB-B100","RH 650V"],
    'HOBOT': ["168","298","Legee -D8"],
    'HP': ["E223D","TPN-C105"],
    'Huawei': ["3 Pro"],
    'Hyundai': ["H-LED32BS5100","HYM-D3031"],
    'iLIFE': ["A12 Pro","A6","V7","V7s Plus"],
    'Intex': ["QS1200","QX2600","SF60220","SF80220-2","SF90220T","SX2100"],
    'iRobot': ["631","780","960","980","Roomba","Roomba 555","Roomba 870","Roomba I3","Roomba i7"],
    'JBL': ["BAR 1300 MK2","Flip 5","Party Box 300","XTREME"],
    'Jura': ["627","638","653","666","688"],
    'Karcher': ["BP 3 Home","FC 7","K 55 PLUS","MV 3 Premium","SC 2 500 C","SC 4","SC3","SC4","SC5","SCP 16000","VC 4","VC 6"],
    'Kenwood': ["BL650","KCC90","KVC51","KVL80","MG 510","MG470","MG510"],
    'KitchenAid': ["5KEK1522EAC","5KEK1722ESX","5KMT2204EAC","5KPM5","5KSB1585EAC","5KSM150","5KSM175PS","5KSM175PSECA","Artisan"],
    'Kitfort': ["KT-1051","KT-1301","KT-2406","KT-2510","KT-532","KT-565","KT-635","KT-711","KT-737","KT-789","KT-902","KT-910"],
    'Krups': ["EA82","EA877","EA89","GVX2","KP103","XN 3006","XN 7101","XP 5080"],
    'Laurastar': ["510","752","LIFT 511","LIFT PLUS 515","Magic"],
    'Lenovo': ["legion 5","yoga"],
    'LG': ["32LA643V","32LB582V","32LB628U","42LM585T","49LF640V","A9N-PRIME","CORDZERO","MC-8047AR","MH-705A","MS2595DIS","SC5610","VC73209UHAS","VK89182NU","VR6570LVMB"],
    'Makita': ["4329","9069","9555HN","DDF458","GA5040C","GA9020S","HR 2470","HR2450","HR2470","HR2810","HR4001C","KP0810C"],
    'Marina': ["CAM 40/22-HL","CAM 95/25","CAM100/25-HL","Cam 80/22","RSM 5/25"],
    'Marshall': ["Kilburn II"],
    'Melitta': ["D-32427","TYP F 57"],
    'Metabo': ["BS 12","BS 14.4","BS 18 L","BS 18 LI","HWW 3500/25 Inox","HWW 4500/25 Inox","HWWI 4500/25 Inox","KHE 2660","KHE 2860"],
    'Midea': ["AM720C3P-C","MK 8076","RVC2108","VCC43A1","VCR S8+"],
    'Miele': ["C1","C3","CM5300","COMPACT C2","S5281","S6230","S8330","SGDA3","SGDF3"],
    'MikroTik': ["CRS328-24P-4S+RM"],
    'Moulinex': ["A21","BY282","FD81","LM811","ME405","MK622832","OW1101","QA25","QA50","QA51","XP33"],
    'Nespresso': ["C113","C30","C61","D30","D40","D85","EN 500 W","GCV1","GDB2","GDV1"],
    'Nocchi': ["BIOX 400/12","MULTINOX-A 200/80-T","PRIOX 460/13 M"],
    'OKAMI': ["R115","U90","V600"],
    'Panasonic': ["ER217","ES8093","F-VXF35R","NC-HU301P","NN-CD565B","NN-CS596S","NN-GD576M","NN-ST251W","SD-2500","SD-257","SD-ZB2502","SR-TMH10","SR-TMH18"],
    'Pedrollo': ["BCm 15/50","DCm30","PUMP 4SKm 100E","SUMOm 2/5","TOP FLOOR 2","Top 3","VXM 10/50-I","Vxm 10/35","vxm 8/35"],
    'Philips': ["EP1220","EP1222","EP2030","EP2231","EP2236","EP3146","EP3246","EP3559","FC 8795","FC 9174","FC 9732","FC6168","FC9071","FC9352","GC 3929","GC 4250","GC 4909","GC 7015","GC 7710","GC 7920","GC 8620","GC 8650","GC 8735","GC 8755","GC 8950","GC 9220","GC 9315","GC 9405","GC 9550","GC 9620","GC 9642","GC 9650","GC 9670","GC 9682","GC 9690","HD8654","HD8827","HD8828","PSG7130","S5585","XC7043","XC8147","XC8347"],
    'Polaris': ["PCM 1520AE","PCM 4008AL","PHB 1036AL","PMC 0349AD","PSS 7510K","PVCR 0735","PVCR 1226","PVCR 3200","PVCS 3060","PWK 1725CGLD"],
    'Powercom': ["IMD-1500AP","IMP-825A","KIN-1500AP","SPT-3000A","WOW-500U","WOW-850U"],
    'Redmond': ["CM701","CM713","RBM-1908","RCM-1517","RCM-1526","RMC-M227S","RMC-M252","RMC-M4504","RMC-M4515","RMC-M800S","RMC-M90","RMC-M95","RV-R150","RV-R450","RV-R500"],
    'Roborock': ["ROBOROCK E4","ROBOROCK S7","S5 max","S51","S55","S6 PURE","S7","S7 MAXV ULTRA","S80ULT"],
    'Robot Coupe': ["CMP 250 Combi","Min MP 160"],
    'Roidmi': ["SDJ01RM","SDJ01RMB","XCQ06RM"],
    'Rommelsbacher': ["EKM 300"],
    'Rowenta': ["DC8561","DG 5995","DG8622","DG8666","DG8990","DW 6020","DW 8122","DW9230","DZ 9020","VR8322"],
    'Saeco': ["HD8743","HD8750","SUP 021YBDR","SUP 033R"],
    'Samsung': ["CE287DNR","Galaxy Tab 2","HT-E6750","MC28H5013AW","ME83XR","MG23K3513AS","SC 6540","SC15K4136HB","SC15K4170HG","SC21K5150HP","SC4520","SC6650","UE32F5000AK","UE40D5500RW","UE43RU7100U","UE55H6200AK","VS20R9076T7"],
    'Sharp': ["KI-RX70","R-7496","VC-790 ET"],
    'Siemens': ["CCM11ST1","EQ. 6 plus S100"],
    'Smeg': ["EGF03RDEU","KLF03CREU","KLF03WHEU","TSF01CREU","TSF01GREU","TSF02PKEU"],
    'Sony': ["BDV-E970W","HCD-DZ820KW","KDL-32CX521","KDL-32R503C","VPL-HW45"],
    'Stadler Form': ["Anton","SFB 500"],
    'Synology': ["DS 218","DS-124","DS224+","DS920+"],
    'Tefal': ["CV9581","DT8230","DT8270","DT9100","FV 9650","FV5697","FV5698","FV9835","FV9865","GV 7310","GV 7760","GV 8461","GV 9071","GV 9220","GV 9611","GV 9620","GV6733","GV6770","GV7760","GV8460","GV8461","GV8955","GV8959","GV8960","GV9070","GV9080","GV9220","GV9230","GV9562","GV9581","GV9590","GV9620","GV9710","GV9720","GV9820","GV9821","RG7455WH","RG7675WH","RG7687WH","RG7867WH","RG8575WH","RG9075WH","TY6545RH","TY6837WO","TY6933WO","TY7231WO","TY9179WO","TY9266WO","TY9690WO","TY9879WO","TY98C0WO","TY9958WQ","TY99C0WO"],
    'Thomas': ["788","Syntho Aquafilter","TWIN T1 AquaFilter","TWIN T1 PET & FRIENDS AQUAFILTER"],
    'Toshiba': ["32AV655PK","32RL9555RB","40L2453RK","55C350"],
    'Vitamix': ["VM0105E","VM0149"],
    'VITEK': ["VT 1698","VT-1191","VT-1514BK","VT-1804","VT-5005","VT-8700","VT-8701"],
    'VORWERK': ["VBS 01-1","VK 140-1"],
    'Weissgauff': ["V12 BLDC 500 Marine Turbo","V13BLDC200","V20 BLDC Wash&Dry"],
    'Whirlpool': ["MT 46/WH"],
    'Wilo': ["MAXO 50/0.5-16","TM 32/7","TMP 32-0,5 EM","TOP-S25/13"],
    'WMF': ["Skyline","Stabmixer LINEO"],
    'Xiaomi': ["B105","B106CN","B108GL","C103","D106","G11","G20","MI Robot Vacuum Mop P","MJST1S","MJSTG1","Robot Vacuum S10","Robot Vacuum S20","S502-00","SDJQR01RR","SDJQR02RR","STYTJ02YM","STYTJ03ZHM"],
    'Zelmer': ["886.5","986.86","986.87","986.88","FD 9404","FD9507"],
    'Zepter': ["LG-812","TF-994","TUTTOLUXO 2S"],
    'Zwilling': ["53006"],
    'Вихрь': ["ДН-400","ФН-1500Л","ФН-2200Л"],
    'Джилекс': ["Джамбо 60/35 Н-24","Фекальник 150/6","водомет 60/52","джамбо 60/35 П-24","джамбо 70/50 П-50"],
    'Зубр': ["ЗДУ-580ЭР","ЗПВ-32-1250","НПГ-Т3-1300","НПФ-1100-Р"],
    'Ресанта': ["ACH-12000/1-Ц","АСН-2000/1-Ц","НД-15500П/35","НФ-17000Л","НФ-24000Л"],
    'Яндекс': ["YNDX-0001","YNDX-00020","YNDX-00026","YNDX-0004","YNDX-00051","YNDX-00052","YNDX-00053","YNDX-00054"]
};

// Detect model from item text based on detected brands
function detectModels(text, brands) {
    // Normalize: collapse multiple spaces, trim
    const lower = (text || '').toLowerCase().replace(/\s+/g, ' ');
    const matches = [];
    for (const brand of (brands || [])) {
        const models = BRAND_MODELS[brand] || [];
        // Sort longest first to prefer longer matches (e.g. "SV11" over "V11")
        const sorted = [...models].sort((a, b) => b.length - a.length);
        for (const model of sorted) {
            const ml = model.toLowerCase().replace(/\s+/g, ' ');
            // For short models (<=3 chars), require word boundary
            if (ml.length <= 3) {
                const re = new RegExp('\\b' + ml.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                if (re.test(lower) && !matches.includes(model)) matches.push(model);
            } else {
                // Also try without spaces for model names like "1000 M" matching "1000M"
                if ((lower.includes(ml) || lower.replace(/\s+/g, '').includes(ml.replace(/\s+/g, '')))
                    && !matches.includes(model)) {
                    // Check this isn't a substring of an already matched longer model
                    const dominated = matches.some(m => m.toLowerCase().includes(ml));
                    if (!dominated) matches.push(model);
                }
            }
        }
    }
    return matches;
}

// Get models available for given brands
function getModelsForBrands(brands) {
    const models = {};
    for (const b of brands) {
        (BRAND_MODELS[b] || []).forEach(m => { models[m] = b; });
    }
    return models;
}

function detectTag(text, dict) {
    const lower = (text || '').toLowerCase();
    const matches = [];
    for (const [tag, keywords] of Object.entries(dict)) {
        for (const kw of keywords) {
            if (lower.includes(kw)) { matches.push(tag); break; }
        }
    }
    return matches;
}

// Load dictionaries from localStorage (or use defaults)
function getDict(key, defaults) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : { ...defaults };
    } catch (e) { return { ...defaults }; }
}

function saveDict(key, dict) {
    localStorage.setItem(key, JSON.stringify(dict));
}

function getPartTypes() { return getDict('lr_dict_parttypes', DEFAULT_PART_TYPES); }
function getBrands() { return getDict('lr_dict_brands', DEFAULT_BRANDS); }
function getAppliances() { return getDict('lr_dict_appliances', DEFAULT_APPLIANCES); }

function detectPartType(t) { return detectTag(t, getPartTypes()); }
function detectBrands(t) { return detectTag(t, getBrands()); }
function detectAppliances(t) { return detectTag(t, getAppliances()); }

// ===== Metadata storage (localStorage, temp until ERPNext custom fields) =====
const Meta = {
    get(itemCode) {
        try {
            const all = JSON.parse(localStorage.getItem('lr_item_meta') || '{}');
            return all[itemCode] || {};
        } catch (e) { return {}; }
    },
    set(itemCode, meta) {
        try {
            const all = JSON.parse(localStorage.getItem('lr_item_meta') || '{}');
            all[itemCode] = { ...(all[itemCode] || {}), ...meta };
            localStorage.setItem('lr_item_meta', JSON.stringify(all));
        } catch (e) {}
    },
    remove(itemCode) {
        try {
            const all = JSON.parse(localStorage.getItem('lr_item_meta') || '{}');
            delete all[itemCode];
            localStorage.setItem('lr_item_meta', JSON.stringify(all));
        } catch (e) {}
    }
};

// ===== Settings =====
const DEFAULT_SETTINGS = {
    locations: ['Авангардная', 'Ленинский', 'Бирюзова', 'Нарния', 'Боксбери', 'У мастера', 'ВЫКУП', 'АВИТО', 'AMWAY'],
    responsible: [],
    groups: ['Запчасти', 'Доноры']
};

function getSettings() {
    const saved = localStorage.getItem('lr_settings');
    return saved ? JSON.parse(saved) : { ...DEFAULT_SETTINGS };
}

function saveSettings(s) {
    localStorage.setItem('lr_settings', JSON.stringify(s));
}

// ===== Format helpers =====
function formatPrice(v) {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v || 0);
}

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getStatusText(wh) {
    if (!wh) return '—';
    if (wh.includes('Подотчёт')) return 'Подотчёт';
    if (wh.includes('Списан')) return 'Списано';
    return 'На складе';
}

function fmtWh(w) { return (w || '—').replace(' - L', ''); }

function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
}

// ===== Item audit info (creation, modification) =====
async function loadItemAudit(code, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<div class="text-muted" style="font-size:12px;">Загрузка...</div>';
    try {
        const doc = await API.getDoc('Item', code);
        const d = doc.data;
        if (!d) { container.innerHTML = ''; return; }

        const created = d.creation ? new Date(d.creation) : null;
        const modified = d.modified ? new Date(d.modified) : null;
        const owner = (d.owner || '').replace(/@.*/, '');
        const modifiedBy = (d.modified_by || '').replace(/@.*/, '');

        const fmtDt = (dt) => dt ? dt.toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit',year:'numeric'}) + ' ' + dt.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'}) : '—';

        // Get activity log / versions for change history
        let changesHtml = '';
        try {
            const versions = await API.getList('Version',
                ['name', 'creation', 'owner', 'data'],
                [['ref_doctype', '=', 'Item'], ['docname', '=', code]],
                10
            );
            const entries = (versions.message || []).reverse();
            if (entries.length) {
                const rows = entries.map(v => {
                    const dt = new Date(v.creation);
                    const who = (v.owner || '').replace(/@.*/, '');
                    let what = '';
                    try {
                        const parsed = JSON.parse(v.data);
                        if (parsed.changed && parsed.changed.length) {
                            what = parsed.changed.map(c => {
                                const field = c[0] || '';
                                const label = field.replace('custom_', '').replace('_', ' ');
                                return `<span style="color:var(--lr-info);">${escHtml(label)}</span>: ${escHtml(String(c[1]||'—').substring(0,30))} → ${escHtml(String(c[2]||'—').substring(0,30))}`;
                            }).join('; ');
                        }
                    } catch(e) {}
                    return `<tr>
                        <td style="white-space:nowrap;">${fmtDt(dt)}</td>
                        <td>${escHtml(who)}</td>
                        <td style="font-size:11px;">${what || '—'}</td>
                    </tr>`;
                }).join('');
                changesHtml = `
                    <div style="margin-top:10px;">
                        <div style="font-size:11px;font-weight:600;color:var(--lr-text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">История изменений</div>
                        <table class="table table-sm" style="font-size:12px;">
                            <thead><tr><th>Дата</th><th>Кто</th><th>Что изменено</th></tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>`;
            }
        } catch(e) {}

        container.innerHTML = `
            <div style="background:var(--lr-bg);border-radius:10px;padding:12px 14px;font-size:12px;color:var(--lr-text-secondary);margin-top:12px;">
                <div style="display:flex;gap:24px;flex-wrap:wrap;">
                    <div><span style="color:var(--lr-text-muted);">Создано:</span> ${fmtDt(created)} <span style="color:var(--lr-text-muted);">от</span> <strong>${escHtml(owner)}</strong></div>
                    <div><span style="color:var(--lr-text-muted);">Изменено:</span> ${fmtDt(modified)} <span style="color:var(--lr-text-muted);">от</span> <strong>${escHtml(modifiedBy)}</strong></div>
                </div>
                ${changesHtml}
            </div>
        `;
    } catch(e) {
        container.innerHTML = '';
    }
}

function toast(msg, type = '') {
    let t = document.getElementById('lr-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'lr-toast';
        t.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 24px;background:#111;color:white;border-radius:12px;font-size:14px;font-weight:500;opacity:0;transform:translateY(10px);transition:all .3s;z-index:3000;box-shadow:0 4px 20px rgba(0,0,0,.2);';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    if (type === 'success') t.style.background = '#53b64c';
    else if (type === 'error') t.style.background = '#dc2626';
    else t.style.background = '#111';
    t.style.opacity = '1'; t.style.transform = 'translateY(0)';
    clearTimeout(t._tm);
    t._tm = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; }, 3000);
}
