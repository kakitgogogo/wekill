var socket = require('Socket');

var Generals = new Map([
    ['CAOCAO', {
        'ChineseName': '曹操',
        'Sex': 'male',
        'Intro': '魏武帝曹操，字孟德，小名阿瞒、吉利，沛国谯人。精兵法，善诗歌，乃治世之能臣，乱世之奸雄也。',
        'Health': 4,
        'Camp': 'WEI',
        'Skills': ['JIANXIONG', 'HUJIA'],
        'IsBoss': true,
    }],
    ['DAQIAO', {
        'ChineseName': '大乔',
        'Sex': 'female',
        'Intro': '庐江皖县人，为乔公长女，孙策之妻，小乔之姊。与小乔并称为“江东二乔”，容貌国色流离。',
        'Health': 3,
        'Camp': 'WU',
        'Skills': ['GUOSE', 'LIULI'],
        'IsBoss': false,
    }],
    ['DIAOCHAN', {
        'ChineseName': '貂蝉',
        'Sex': 'female',
        'Intro': '中国古代四大美女之一，有闭月羞花之貌。司徒王允之义女，由王允授意施行连环计，离间董卓、吕布，借布手除卓。后貂蝉成为吕布的妾。',
        'Health': 3,
        'Camp': 'QUN',
        'Skills': ['LIJIAN', 'BIYUE'],
        'IsBoss': false,
    }],
    ['GANNING', {
        'ChineseName': '甘宁',
        'Sex': 'male',
        'Intro': '字兴霸，巴郡临江人，祖籍荆州南阳郡。为人勇猛刚强，忠心耿耿，勇往无前。曾带兵百人于二更奇袭曹营，大挫其锐气。',
        'Health': 4,
        'Camp': 'WU',
        'Skills': ['QIXI'],
        'IsBoss': false,
    }],
    ['GUANYU', {
        'ChineseName': '关羽',
        'Sex': 'male',
        'Intro': '字云长，本字长生，并州河东解州人。五虎上将之首，爵至汉寿亭侯，谥曰“壮缪侯”。被奉为“关圣帝君”，崇为“武圣”。',
        'Health': 4,
        'Camp': 'SHU',
        'Skills': ['WUSHENG'],
        'IsBoss': false,
    }],
    ['GUOJIA', {
        'ChineseName': '郭嘉',
        'Sex': 'male',
        'Intro': '字奉孝，颍川阳翟人，官至军师祭酒。惜天妒英才，英年早逝。有诗云：“良计环环不遗策，每临制变满座惊”。',
        'Health': 3,
        'Camp': 'WEI',
        'Skills': ['TIANDU', 'YIJI'],
        'IsBoss': false,
    }],
    ['HUANGGAI', {
        'ChineseName': '黄盖',
        'Sex': 'male',
        'Intro': '字公覆，零陵郡泉陵县人。官至偏将军、武陵太守。以苦肉计骗曹孟德，亲往诈降，火烧战船，重创敌军。',
        'Health': 4,
        'Camp': 'WU',
        'Skills': ['KUROU'],
        'IsBoss': false,
    }],
    ['HUANGYUEYING', {
        'ChineseName': '黄月英',
        'Sex': 'female',
        'Intro': '荆州沔南白水人，沔阳名士黄承彦之女，诸葛亮之妻，诸葛瞻之母。容貌甚丑，而有奇才：上通天文，下察地理，韬略近于诸书无所不晓，诸葛亮在南阳闻其贤而迎娶。',
        'Health': 3,
        'Camp': 'SHU',
        'Skills': ['JIZHI', 'QICAI'],
        'IsBoss': false,
    }],
    ['HUATUO', {
        'ChineseName': '华佗',
        'Sex': 'male',
        'Intro': '字元化，一名旉，沛国谯人，“建安三神医”之一。集平生之所得著《青囊经》，现已失传。',
        'Health': 3,
        'Camp': 'QUN',
        'Skills': ['JIJIU', 'QINGNANG'],
        'IsBoss': false,
    }],
    ['LIUBEI', {
        'ChineseName': '刘备',
        'Sex': 'male',
        'Intro': '先主姓刘，讳备，字玄德，涿郡涿县人，汉景帝子中山靖王胜之后也。以仁德治天下。',
        'Health': 4,
        'Camp': 'SHU',
        'Skills': ['RENDE', 'JIJIANG'],
        'IsBoss': true,
    }],
    ['LUXUN', {
        'ChineseName': '陆逊',
        'Sex': 'male',
        'Intro': '本名陆议，字伯言，吴郡吴县人。历任东吴大都督、丞相。吴大帝孙权兄孙策之婿，世代为江东大族。以谦逊之书麻痹关羽，夺取荆州，又有火烧连营大破蜀军。',
        'Health': 3,
        'Camp': 'WU',
        'Skills': ['QIANXUN', 'LIANYING'],
        'IsBoss': false,
    }],
    ['LVBU', {
        'ChineseName': '吕布',
        'Sex': 'male',
        'Intro': '字奉先，五原郡九原县人。三国第一猛将，曾独力战刘关张三人，其武力世之无双。时人语曰：“人中有吕布，马中有赤兔。”',
        'Health': 4,
        'Camp': 'QUN',
        'Skills': ['WUSHUANG'],
        'IsBoss': false,
    }],
    ['LVMENG', {
        'ChineseName': '吕蒙',
        'Sex': 'male',
        'Intro': '字子明，汝南富陂人。陈寿评曰：“吕蒙勇而有谋断，识军计，谲郝普，擒关羽，最其妙者。初虽轻果妄杀，终于克己，有国士之量，岂徒武将而已乎！',
        'Health': 4,
        'Camp': 'WU',
        'Skills': ['KEJI'],
        'IsBoss': false,
    }],
    ['MACHAO', {
        'ChineseName': '马超',
        'Sex': 'male',
        'Intro': '字孟起，扶风茂陵人。面如冠玉，目如流星，虎体猿臂，彪腹狼腰，声雄力猛。因衣着讲究，举止非凡，故人称“锦马超”。麾铁骑，捻金枪。',
        'Health': 4,
        'Camp': 'SHU',
        'Skills': ['MASHU', 'TIEJI'],
        'IsBoss': false,
        'subDistance': 1,
    }],
    ['SIMAYI', {
        'ChineseName': '司马懿',
        'Sex': 'male',
        'Intro': '晋宣帝，字仲达，河内温人。曾任职过曹魏的大都督，太尉，太傅。少有奇节，聪明多大略，博学洽闻，伏膺儒教，世之鬼才也。',
        'Health': 3,
        'Camp': 'WEI',
        'Skills': ['FANKUI', 'GUICAI'],
        'IsBoss': false,
    }],
    ['SUNQUAN', {
        'ChineseName': '孙权',
        'Sex': 'male',
        'Intro': '吴大帝，字仲谋，吴郡富春县人。统领吴与蜀魏三足鼎立，制衡天下。',
        'Health': 4,
        'Camp': 'WU',
        'Skills': ['ZHIHENG', 'JIUYUAN'],
        'IsBoss': true,
    }],
    ['SUNSHANGXIANG', {
        'ChineseName': '孙尚香',
        'Sex': 'female',
        'Intro': '孙夫人，乃孙权之妹。刘备定荆州，孙权进妹与其结姻，重固盟好。孙夫人才捷刚猛，有诸兄之风。后人为其立庙，号曰“枭姬庙”。',
        'Health': 3,
        'Camp': 'WU',
        'Skills': ['LIANYIN', 'XIAOJI'],
        'IsBoss': false,
    }],
    ['XIAHOUDUN', {
        'ChineseName': '夏侯惇',
        'Sex': 'male',
        'Intro': '字元让，沛国谯人。有拔矢啖睛之勇，性格勇猛刚烈。',
        'Health': 4,
        'Camp': 'WEI',
        'Skills': ['GANGLIE'],
        'IsBoss': false,
    }],
    ['XUCHU', {
        'ChineseName': '许褚',
        'Sex': 'male',
        'Intro': '字仲康，谯国谯县人。和典韦一同统率着曹操的亲卫队“虎卫军”。因为他十分勇猛，所以有“虎痴”的绰号。曾有裸衣斗马超之举。',
        'Health': 4,
        'Camp': 'WEI',
        'Skills': ['LUOYI'],
        'IsBoss': false,
    }],
    ['ZHANGFEI', {
        'ChineseName': '张飞',
        'Sex': 'male',
        'Intro': '字翼德，涿郡人，燕颔虎须，豹头环眼。有诗云：“长坂坡头杀气生，横枪立马眼圆睁。一声好似轰雷震，独退曹家百万兵”。',
        'Health': 4,
        'Camp': 'SHU',
        'Skills': ['PAOXIAO'],
        'IsBoss': false,
    }],
    ['ZHANGLIAO', {
        'ChineseName': '张辽',
        'Sex': 'male',
        'Intro': '字文远，魏雁门马邑人。官至前将军、征东将军、晋阳侯。武功高强，又谋略过人，多次建立奇功，以800人突袭孙权十万大军，皆望风披靡。',
        'Health': 4,
        'Camp': 'WEI',
        'Skills': ['TUXI'],
        'IsBoss': false,
    }],
    ['ZHAOYUN', {
        'ChineseName': '赵云',
        'Sex': 'male',
        'Intro': '字子龙，常山真定人。身长八尺，姿颜雄伟。长坂坡单骑救阿斗，先主云：“子龙一身都是胆也。',
        'Health': 4,
        'Camp': 'SHU',
        'Skills': ['LONGDAN'],
        'IsBoss': false,
    }],
    ['ZHENJI', {
        'ChineseName': '甄姬',
        'Sex': 'female',
        'Intro': '中山无极人，别称甄洛或甄宓，庙号文昭甄皇后。魏文帝曹丕的正室。懂诗文，有倾国倾城之貌，《洛神赋》即是曹植为她所作。',
        'Health': 3,
        'Camp': 'WEI',
        'Skills': ['QINGGUO', 'LUOSHEN'],
        'IsBoss': false,
    }],
    ['ZHOUYU', {
        'ChineseName': '周瑜',
        'Sex': 'male',
        'Intro': '字公瑾，庐江舒县人，任东吴三军大都督，雄姿英发，人称“美周郎”。赤壁之战前，巧用反间计杀了精通水战的叛将蔡瑁、张允。',
        'Health': 3,
        'Camp': 'WU',
        'Skills': ['YINGZI', 'FANJIAN'],
        'IsBoss': false,
    }],
    ['ZHUGELIANG', {
        'ChineseName': '诸葛亮',
        'Sex': 'male',
        'Intro': '字孔明，号卧龙，琅琊阳都人，蜀汉丞相。在世时被封为武乡侯，谥曰忠武侯。著有《出师表》、《诫子书》等。怀不世之才，以空城戏司马，能观星象而通鬼神。',
        'Health': 3,
        'Camp': 'SHU',
        'Skills': ['GUANXING', 'KONGCHENG'],
        'IsBoss': false,
    }],
]);

var Skills = new Map([
    // 刘备
    ['RENDE', {
        'ChineseName': '仁德',
        'Intro': '仁德:你可以将你的任意张手牌分配给场上任意一个或多个角色（对方不能拒绝），若一个回合内给出的牌超过两张，你回复1体力',
        'IsActive': true,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.playInitialMore = () => {
                game.nRende = 0;
                game.nRendeCure = 0;
                skillControl.nMaxLaunch = 100;
                skillControl.active();
            };

            game.playFinishClearMore = () => {
                game.nRende = 0;
                game.nRendeCure = 0;
                skillControl.nMaxLaunch = 0;
                skillControl.deactive();
            };

            skillControl.launchSkill = () => {
                game.changePhase('wait');
                game.endPlayButton.active = false;
                game.onChosenCardsChange = () => {
                    if(game.chosenCards.size >= 1) {
                        for(let i = 0; i < game.players.length; ++i) {
                            if(game.seat === i) continue;
                            if(game.playerControls[i].isDead) continue;
                            game.activePlayer(game.players[i]);
                            game.playerControls[i].chooseHandler = () => {
                                let chosenCardIds = Array.from(game.chosenCards);
                                game.chosenCards.clear();
                                game.deactivePlayers();
                                game.cancelButton.active = false;
                                game.activeEndPlayButton();
                                game.onChosenCardsChange = () => {};

                                let sendCards = [], chosenCards = [];
                                let cards = game.cardsBox.children;
                                for(let id of chosenCardIds) {
                                    let card = cards[id];
                                    let cardInfo = game.getCardInfo(card);
                                    sendCards.push(cardInfo);
                                    chosenCards.push(card);
                                }
                                for(let card of chosenCards) {
                                    card.removeFromParent(true);
                                    --game.self.nCards;
                                }
                                game.selfSortCards();
                                game.setGeneralCardsCount(game.seat, game.self.nCards);
                                game.setGeneralCardsCount(i, game.playerControls[i].nCards+chosenCardIds.length);
                                game.sendCardsTo(sendCards, i);
                                game.nRende += chosenCardIds.length;
                                if(game.nRende >= 2 && game.nRendeCure < 1 && game.self.health < game.self.maxHealth) {
                                    game.nRendeCure++;
                                    game.curePlayers([game.seat], 1);
                                }
                                
                                game.changePhase('play');
                            };
                        }
                    }
                    else {
                        game.deactivePlayers();
                    }
                };
                game.cancelButton.active = true;
                game.cancelHandler = () => {
                    game.deactivePlayers();
                    game.cancelButton.active = false;
                    game.activeEndPlayButton();
                    game.onChosenCardsChange = () => {};
                    game.changePhase('play');
                }
            };
        }
    }],
    ['JIJIANG', {
        'ChineseName': '激将',
        'Intro': '激将:主公技,你需要打出或者使用杀时，可以询问在场的蜀势力角色是否替你打出一张杀供你使用',
        'IsActive': true,
        'IsBossSkill': true,
    }],

    // 关羽
    ['WUSHENG', {
        'ChineseName': '武圣',
        'Intro': '武圣:你的红花色牌可以作为杀使用或打出',
        'IsActive': true,
        'IsBossSkill': false,
    }],

    // 张飞
    ['PAOXIAO', {
        'ChineseName': '咆哮',
        'Intro': '咆哮:你的回合内可以使用无限张杀',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.nMaxKills = 100;
        },
    }],

    // 赵云
    ['LONGDAN', {
        'ChineseName': '龙胆',
        'Intro': '龙胆:你的杀可以作为闪使用,你的闪可以作为杀使用',
        'IsActive': true,
        'IsBossSkill': false,
    }],

    // 马超
    ['TIEJI', {
        'ChineseName': '铁骑',
        'Intro': '铁骑:你对一个目标使用杀后,可以进行一次判定,如判定为红色,则该杀不可以被闪避',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['MASHU', {
        'ChineseName': '马术',
        'Intro': '马术:锁定技 你对任意目标计算距离时始终-1',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 诸葛亮
    ['GUANXING', {
        'ChineseName': '观星',
        'Intro': '观星:回合开始阶段,你可以观看牌堆顶的X张牌（X为在场生还人数且最大为5）然后将这些牌按你需要的顺序放置于牌堆顶或者牌堆底',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['KONGCHENG', {
        'ChineseName': '空城',
        'Intro': '空城:锁定技,如果你没有手牌, 则不能成为杀或者决斗的对象',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 黄月英
    ['JIZHI', {
        'ChineseName': '集智',
        'Intro': '集智:你每使用一张非延迟锦囊,可以摸一张牌',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.whenMagicLaunch = () => {
                socket.send({'event':'drawCards', 'count':1});
            };
        },
    }],
    ['QICAI', {
        'ChineseName': '奇才',
        'Intro': '奇才:你的所有锦囊无限距离',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.self.magicDistance = 100;
        },
    }],

    // 曹操
    ['JIANXIONG', {
        'ChineseName': '奸雄',
        'Intro': '奸雄:你可以获得对你造成伤害的牌',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['HUJIA', {
        'ChineseName': '护驾',
        'Intro': '护驾:主公技,你需要出闪时,可以询问在场的魏势力角色是否替你打出一张闪',
        'IsActive': false,
        'IsBossSkill': true,
    }],

    // 司马懿
    ['FANKUI', {
        'ChineseName': '反馈',
        'Intro': '反馈:你可以获得对你造成伤害的目标的一张牌',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['GUICAI', {
        'ChineseName': '鬼才',
        'Intro': '鬼才:在判定牌生效前,你可以打出一张手牌代替当前判定牌而生效',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 郭嘉
    ['YIJI', {
        'ChineseName': '遗计',
        'Intro': '遗计:你每受到1伤害,可以摸两张牌并将这两张牌分配给包括你在内的任意角色',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['TIANDU', {
        'ChineseName': '天妒',
        'Intro': '天妒:锁定技,当判定牌生效时,你可以获得这张判定牌',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 张辽
    ['TUXI', {
        'ChineseName': '突袭',
        'Intro': '突袭:摸牌阶段,你可以选择不摸牌,并指定场上最多两个目标,获得每个目标的一张手牌',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 甄姬
    ['LUOSHEN', {
        'ChineseName': '洛神',
        'Intro': '洛神:回合开始阶段,你可以进行一次判定,若花色为黑色,则你获得这张牌,并可以继续发动洛神,直到判定为红色为止',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['QINGGUO', {
        'ChineseName': '倾国',
        'Intro': '倾国,你的黑色牌可以作为闪使用',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 夏侯惇
    ['GANGLIE', {
        'ChineseName': '刚烈',
        'Intro': '刚烈:如果有角色对你造成伤害,则你可以选择发动一次判定,若判定不为红桃,则对你造成伤害的人必须弃两张手牌或者受到你造成的1伤害',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 许褚
    ['LUOYI', {
        'ChineseName': '裸衣',
        'Intro': '裸衣:摸牌阶段,你可以少摸1张牌,若如此做,该回合内你的杀和决斗伤害+1',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 孙权
    ['ZHIHENG', {
        'ChineseName': '制衡',
        'Intro': '制衡:出牌阶段,你可以弃置任意数量的牌并从牌堆顶获得等量的牌',
        'IsActive': true,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.playInitialMore = () => {
                game.nZhiHeng = 0;
                skillControl.nMaxLaunch = 100;
                skillControl.active();
            };

            game.playFinishClearMore = () => {
                game.nZhiHeng = 0;
                skillControl.nMaxLaunch = 0;
                skillControl.deactive();
            };

            skillControl.launchSkill = () => {
                if(game.nZhiHeng >= 1) return;
                game.changePhase('wait');
                game.endPlayButton.active = false;
                game.onChosenCardsChange = () => {
                    if(game.chosenCards.size >= 1) {
                        game.confirmButton.active = true;
                    }
                    else {
                        game.confirmButton.active = false;
                    }
                };
                game.confirmHandler = () => {
                    game.confirmButton.active = false;
                    game.cancelButton.active = false;
                    game.activeEndPlayButton();
                    game.onChosenCardsChange = () => {};

                    let n = game.chosenCards.size;
                    game.discardChosenCard();
                    socket.send({'event':'drawCards', 'count':n});
                    
                    game.nZhiHeng = 1;
                    game.changePhase('play');
                }
                game.cancelButton.active = true;
                game.cancelHandler = () => {
                    game.confirmButton.active = false;
                    game.cancelButton.active = false;
                    game.activeEndPlayButton();
                    game.onChosenCardsChange = () => {};
                    game.changePhase('play');
                }
            };
        },
    }],
    ['JIUYUAN', {
        'ChineseName': '救援',
        'Intro': '救援:主公技,当你处于濒死阶段,吴势力角色对你使用的桃为你恢复2体力',
        'IsActive': false,
        'IsBossSkill': true,
    }],

    // 甘宁
    ['QIXI', {
        'ChineseName': '奇袭',
        'Intro': '奇袭:你的黑色手牌可以作为过河拆桥使用',
        'IsActive': true,
        'IsBossSkill': false,
    }],

    // 黄盖
    ['KUROU', {
        'ChineseName': '苦肉',
        'Intro': '苦肉:出牌阶段,你可以自减1体力并摸两张牌,苦肉在一回合内可以无限次发动',
        'IsActive': true,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.playInitialMore = () => {
                skillControl.nMaxLaunch = 100;
                skillControl.active();
            };

            game.playFinishClearMore = () => {
                skillControl.nMaxLaunch = 0;
                skillControl.deactive();
            };

            skillControl.launchSkill = () => {
                socket.send({'event':'drawCards', 'count':2});
                game.damageOthers([game.seat], 1, game.seat);
            }
        }
    }],

    // 周瑜
    ['YINGZI', {
        'ChineseName': '英姿',
        'Intro': '英姿:摸牌阶段,你可以额外摸一张牌',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.nDrawCards = 3;
        },
    }],
    ['FANJIAN', {
        'ChineseName': '反间',
        'Intro': '反间:出牌阶段,你可以让一名角色说一个花色,并抽取你一张手牌,展示之,如果展示花色与其所说花色不同,则你对他造成1伤害。该角色将获得这张牌',
        'IsActive': true,
        'IsBossSkill': false,
    }],

    // 陆逊
    ['QIANXUN', {
        'ChineseName': '谦逊',
        'Intro': '谦逊:锁定技,你不能成为顺手牵羊和乐不思蜀的目标',
        'IsActive': false,
        'IsBossSkill': false,
    }],
    ['LIANYING', {
        'ChineseName': '联营',
        'Intro': '联营:当你失去最后一张手牌,你可以马上摸一张牌',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 大乔
    ['GUOSE', {
        'ChineseName': '国色',
        'Intro': '国色:你的方块花色牌可以当[乐不思蜀]使用',
        'IsActive': true,
        'IsBossSkill': false,
    }],
    ['LIULI', {
        'ChineseName': '流离',
        'Intro': '流离:当你成为杀的目标时,你可以弃一张牌,并将杀的目标转换为你攻击范围内的任意一目标',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 吕蒙
    ['KEJI', {
        'ChineseName': '克己',
        'Intro': '克己:如果出牌阶段你没有出和使用杀,则你可以跳过弃牌阶段',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.playInitialMore = () => {
                game.skipDiscardPhase = false;
            };

            game.beforeDiscard = () => {
                if(game.nKills === 0) {
                    game.skipDiscardPhase = true;
                }
            };
        },
    }],

    // 孙尚香
    ['LIANYIN', {
        'ChineseName': '联姻',
        'Intro': '联姻:你可以指定一名已经受到伤害的男性,弃手牌两张,则你和该角色恢复1体力',
        'IsActive': true,
        'IsBossSkill': false,
    }],
    ['XIAOJI', {
        'ChineseName': '枭姬',
        'Intro': '枭姬:你每失去装备去中的一件装备,摸两张牌',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.afterUnloadEquipment = () => {
                socket.send({'event':'drawCards', 'count':2});
            };
        },
    }],

    // 吕布
    ['WUSHUANG', {
        'ChineseName': '无双',
        'Intro': '无双:锁定技,你的杀必须出两张闪才可以抵消,和你决斗时每次必须出两张杀',
        'IsActive': false,
        'IsBossSkill': false,
    }],

    // 貂蝉
    ['LIJIAN', {
        'ChineseName': '离间',
        'Intro': '离间,出牌阶段,你可以弃一张牌并指定两个男性角色决斗,由你指定谁是被决斗者',
        'IsActive': true,
        'IsBossSkill': false,
    }],
    ['BIYUE', {
        'ChineseName': '闭月',
        'Intro': '闭月,回合结束阶段,你可以摸一张牌',
        'IsActive': false,
        'IsBossSkill': false,
        'launch': (game, skillControl=null) => {
            game.afterRoundOver = () => {
                if(!game.self.isDead) {
                    socket.send({'event':'drawCards', 'count':1});
                }
            };
        },
    }],

    // 华佗
    ['QINGNANG', {
        'ChineseName': '倾囊',
        'Intro': '倾囊:出牌阶段,你可以弃一张手牌,并指定一名已受伤的角色,令其恢复1体力',
        'IsActive': true,
        'IsBossSkill': false,
    }],
    ['JIJIU', {
        'ChineseName': '急救',
        'Intro': '急救:你的回合外,如果有角色进入濒死阶段,你可以弃一张红色花色牌,视为你对其使用了一个桃',
        'IsActive': false,
        'IsBossSkill': false,
    }],
]);

var Camps = {'WEI':'魏', 'SHU':'蜀', 'WU':'吴', 'QUN':'群'};

var noaction = () => {
};

var cardForbidden = (game, cardControl) => {
    cardControl.onfirstshortclick = noaction;
    cardControl.onsecondshortclick = noaction;
};

var CardOperationWrap = (func, game, cardControl) => {
    cardControl.onfirstshortclick = () => {   
        if(game.chosenCards.size === 1) {
            game.endPlayButton.active = false;
            game.confirmButton.active = true;
            game.confirmHandler = () => {
                game.activeEndPlayButton();
                game.confirmButton.active = false;
                game.discardChosenCard();
                func();
            };
        }
    };
    cardControl.onsecondshortclick = () => {
        game.activeEndPlayButton();
        game.confirmButton.active = false;
    };
};

var doKill = (game, cardControl, hasColor=true) => {
    if(game.nKills < game.getNMaxKills()) {
        game.endPlayButton.active = false;
        for(let i = 0; i < game.players.length; ++i) {
            if(game.seat === i) continue;
            if(game.playerControls[i].isDead) continue;
            if(game.canKillPlayer && game.canKillPlayer !== i) continue;
            let dis = game.getDistance(game.self, game.playerControls[i]);
            console.log('distance:'+dis);
            if(game.getWeaponDistance() >= dis) {
                cardControl.activePlayer(game.players[i]);
                game.playerControls[i].chooseHandler = () => {
                    cardControl.deactivePlayers();
                    game.discardChosenCard();
                    ++game.nKills;
                    game.lastKill = i;
                    game.canKillPlayer = null;
                    if(
                        hasColor
                        && (game.self.equipments['Weapon'] === null 
                            || game.self.equipments['Weapon'][2] !== 'QINGGANGJIAN')
                        && game.playerControls[i].equipments['Armor'] !== null 
                        && game.playerControls[i].equipments['Armor'][2] === 'RENWANGDUN'
                        && (cardControl.cardColor === 'CLUB' || cardControl.cardColor === 'SPADE')
                    ) {
                        game.activeEndPlayButton();
                        game.cancelButton.active = false;
                        game.afterKillFailedDefault(i);
                        return;
                    }
                    game.cancelButton.active = false;
                    game.requestCards([[null, null, 'SHAN']], i, 
                        () => {
                            game.afterKillFailed(i);
                        }, 
                        () => {
                            game.afterKillSucceeded(i);
                        }
                    );
                };
            }
        }
    }
};

var nPlayers = 3;
var doKillNPlayers = (game, cardControl, hasColor=true) => {
    if(game.nKills < game.getNMaxKills()) {
        game.endPlayButton.active = false;
        let n = Math.min(nPlayers, game.getAlivePlayersWithoutSelf(game.seat).length);
        cardControl.chosenPlayers = [];
        for(let i = 0; i < game.players.length; ++i) {
            if(game.seat === i) continue;
            if(game.playerControls[i].isDead) continue;
            if(game.canKillPlayer && game.canKillPlayer !== i) continue;
            let dis = game.getDistance(game.self, game.playerControls[i]);
            if(game.getWeaponDistance() >= dis) {
                cardControl.activePlayer(game.players[i]);
                game.playerControls[i].chooseHandler = () => {
                    if(n === 1) {
                        cardControl.choosePlayer(game.players[i], i);
                        cardControl.deactivePlayers();
                        game.discardChosenCard();
                        ++game.nKills;
                        game.lastKill = i;
                        game.canKillPlayer = null;
                        for(let j = 0; j < cardControl.chosenPlayers.length; ++j) {
                            let p = cardControl.chosenPlayers[j];
                            if(
                                hasColor
                                && (game.self.equipments['Weapon'] === null 
                                    || game.self.equipments['Weapon'][2] !== 'QINGGANGJIAN')
                                && game.playerControls[p].equipments['Armor'] !== null 
                                && game.playerControls[p].equipments['Armor'][2] === 'RENWANGDUN'
                                && (cardControl.cardColor === 'CLUB' || cardControl.cardColor === 'SPADE')
                            ) {
                                cardControl.chosenPlayers.splice(j, 1);
                                --j;
                            }
                        }
                        game.cancelButton.active = false;
                        game.requestCardsForMultiPlayers([[null, null, 'SHAN']], cardControl.chosenPlayers, 
                            (seat) => {
                                game.afterKillFailed(seat);
                            }, 
                            (seat) => {
                                game.afterKillSucceeded(seat);
                            }
                        );
                    }
                    else {
                        n--;
                        cardControl.choosePlayer(game.players[i], i);
                    }
                };
            }
        }
    };
};

var launchMagicToOneWrap = (game, cardControl, isValid, effect) => {
    cardControl.onfirstshortclick = () => {
        if(game.chosenCards.size === 1) {
            game.endPlayButton.active = false;
            for(let i = 0; i < game.players.length; ++i) {
                if(isValid(i)) {
                    cardControl.activePlayer(game.players[i]);
                    game.playerControls[i].chooseHandler = () => {
                        cardControl.deactivePlayers();
                        game.discardChosenCard();
                        effect(i);
                    };
                }
            }
        }
    };
    cardControl.onsecondshortclick = () => {
        game.activeEndPlayButton();
        cardControl.deactivePlayers();
    };
};

var chooseAnother = (game, cardControl, isValid, effect) => {
    cardControl.deactivePlayers();
    for(let i = 0; i < game.players.length; ++i) {
        if(isValid(i)) {
            cardControl.activePlayer(game.players[i]);
            game.playerControls[i].chooseHandler = () => {
                cardControl.deactivePlayers();
                game.discardChosenCard();
                effect(i);
            };
        }
    }
};

var Cards = new Map([
    ['SHA', {
        'type': 'base',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            cardControl.onfirstshortclick = () => {
                if(game.chosenCards.size === 1) {
                    doKill(game, cardControl, true);
                }
            };
            cardControl.onsecondshortclick = () => {
                game.activeEndPlayButton();
                cardControl.deactivePlayers();
            };
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['SHAN', {
        'type': 'base',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': cardForbidden,
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['TAO', {
        'type': 'base',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            cardControl.onfirstshortclick = () => {
                if(game.chosenCards.size === 1 && game.self.health < game.self.maxHealth) {
                    game.endPlayButton.active = false;
                    game.confirmButton.active = true;
                    game.confirmHandler = () => {
                        game.activeEndPlayButton();
                        game.confirmButton.active = false;
                        game.discardChosenCard();
                        game.curePlayers([game.self.seat], 1);
                    };
                }
            };
            cardControl.onsecondshortclick = () => {
                game.activeEndPlayButton();
                game.confirmButton.active = false;
            };
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],

    ['BAGUAZHEN', {
        'type': 'armor',
        'abbreviation': '八卦',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Armor');
                game.armorControl.hasEquiped = true;
                game.armorControl.launchSkill = () => {
                    game.judge(
                        (cards) => {
                            let card = cards[0];
                            if(card[0] === 'DIAMOND' || card[0] === 'HEART') 
                                return true;
                            else return false;
                        },
                        () => {
                            game.armorControl.requestCards.pop();
                            if(game.armorControl.requestCards.length === 0) {
                                game.armorControl.allMeetHandler();
                            }
                        },
                        () => {
                        }
                    )
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        'unload': (game) => {
            game.armorControl.hasEquiped = false;
            game.armorControl.launchSkill = () => {};
        },
    }],
    ['JUEYING', {
        'type': 'horse+1',
        'abbreviation': '绝影',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'HorsePlusOne');
                game.self.plusDistance = 1;
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.self.plusDistance = 0;
        },
    }],
    ['DILU', {
        'type': 'horse+1',
        'abbreviation': '的卢',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'HorsePlusOne');
                game.self.plusDistance = 1;
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.self.plusDistance = 0;
        },
    }],
    ['ZHUAHUANGFEIDIAN', {
        'type': 'horse+1',
        'abbreviation': '爪黄',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'HorsePlusOne');
                game.self.plusDistance = 1;
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.self.plusDistance = 0;
        },
    }],
    ['CHITU', {
        'type': 'horse-1',
        'abbreviation': '赤兔',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'HorseSubOne');
                game.self.subDistance = 1;
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.self.subDistance = 0;
        },
    }],
    ['DAWAN', {
        'type': 'horse-1',
        'abbreviation': '大宛',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'HorseSubOne');
                game.self.subDistance = 1;
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.self.subDistance = 0;
        },
    }],
    ['ZIXING', {
        'type': 'horse-1',
        'abbreviation': '紫骍',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'HorseSubOne');
                game.self.subDistance = 1;
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.self.subDistance = 0;
        },
    }],
    ['ZHUGELIANNU', {
        'type': 'weapon',
        'abbreviation': '诸葛',
        'distance': 1,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 1;
                };
                game.getNMaxKills = () => {
                    return 100;
                }
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.getNMaxKills = () => {
                return game.nMaxKills;
            };
        },
    }],
    ['CIXIONGSHUANGGUJIAN', {
        'type': 'weapon',
        'abbreviation': '雌雄',
        'distance': 2,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 2;
                };
                game.afterKillSucceeded = (seat) => {
                    game.afterKillSucceededDefault(seat);
                    if(game.self.sex === game.playerControls[seat].sex) {
                        return;
                    }
                    let option2 = null;
                    if(game.playerControls[seat].nCards > 0) {
                        option2 = '自己弃一';
                    }
                    game.giveTwoOptions(seat, '对方摸一', option2, 
                        () => {
                            socket.send({'event':'drawCards', 'count':1});
                        },
                        () => {
                            game.requestCardsForcibly([[null, null, null]], seat);
                        }
                    );
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.afterKillSucceeded = (seat) => {
                game.afterKillSucceededDefault(seat);
            };
        },
    }],
    ['QINGGANGJIAN', {
        'type': 'weapon',
        'abbreviation': '青釭',
        'distance': 2,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 2;
                };
                game.deorateRequestCardsData = (data) => {
                    data.ignoreArmor = true;
                    return data;
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.deorateRequestCardsData = (data) => {return data;};
        },
    }],
    ['QINGLONGYANYUEDAO', {
        'type': 'weapon',
        'abbreviation': '青龙',
        'distance': 3,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 3;
                };
                game.afterKillFailed = (seat) => {
                    game.nKills--;
                    game.canKillPlayer = game.lastKill;
                    game.playSpecifiedCard([null, null, 'SHA'], () => {
                        game.nKills++;
                        game.canKillPlayer = null;
                        game.afterKillFailedDefault(seat);
                    });
                };
                game.afterKillSucceeded = (seat) => {
                    game.afterKillSucceededDefault(seat);
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.afterKillFailed = (seat) => {
                game.afterKillFailedDefault(seat);
            };
            game.afterKillSucceeded = (seat) => {
                game.afterKillSucceededDefault(seat);
            };
        },
    }],
    ['ZHANGBASHEMAO', {
        'type': 'weapon',
        'abbreviation': '丈八',
        'distance': 3,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 3;
                };
                game.weaponControl.nMaxLaunch = 100;
                game.weaponControl.enableCount = 100;
                game.weaponControl.launchSkill = () => {
                    if(game.nKills >= game.getNMaxKills()) return;
                    game.changePhase('wait');
                    let killCardControl = null;
                    game.onChosenCardsChange = () => {
                        if(game.chosenCardsMeetRequest([[null, null, null], [null, null, null]])) {
                            let cards = game.cardsBox.children;
                            let chosenCards = Array.from(game.chosenCards);
                            killCardControl = cards[chosenCards[0]].getComponent('CardControl');
                            doKill(game, killCardControl, false);
                            killCardControl.onsecondshortclick = () => {
                                killCardControl.deactivePlayers();
                                killCardControl = null;
                            };
                        }
                        else {
                            if(killCardControl)
                                killCardControl.deactivePlayers();
                        }
                    };
                    game.cancelButton.active = true;
                    game.cancelHandler = () => {
                        game.confirmButton.active = false;
                        game.cancelButton.active = false;
                        game.activeEndPlayButton();
                        game.changePhase('play');
                    }
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.weaponControl.nMaxLaunch = 0;
            game.weaponControl.enableCount = 0;
            game.weaponControl.launchSkill = () => {};
        },
    }],
    ['GUANSHIFU', {
        'type': 'weapon',
        'abbreviation': '贯石',
        'distance': 3,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 3;
                };
                game.afterKillFailed = (seat) => {
                    game.discardToRealize(2, () => {
                        game.activeEndPlayButton();
                        game.afterKillSucceededDefault(seat);
                    }, () => {
                        game.activeEndPlayButton();
                        game.afterKillFailedDefault(seat);
                    });
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.afterKillFailed = (seat) => {
                game.afterKillFailedDefault(seat);
            };
        },
    }],
    ['FANGTIANHUAJI', {
        'type': 'weapon',
        'abbreviation': '方天',
        'distance': 4,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 4;
                };
                game.weaponControl.nMaxLaunch = 100;
                game.weaponControl.enableCount = 100;
                game.weaponControl.launchSkill = () => {
                    if(game.nKills >= game.getNMaxKills()) return;
                    let cards = game.cardsBox.children;
                    if(cards.length !== 1 || cards[0].getComponent('CardControl').cardName !== 'SHA')
                        return;
                    game.changePhase('wait');
                    game.onChosenCardsChange = () => {
                        if(game.chosenCardsMeetRequest([[null, null, 'SHA']])) {
                            let chosenCards = Array.from(game.chosenCards);
                            let killCardControl = cards[chosenCards[0]].getComponent('CardControl');
                            nPlayers = 3;
                            doKillNPlayers(game, killCardControl);
                            killCardControl.onsecondshortclick = () => {
                                game.activeEndPlayButton();
                                killCardControl.deactivePlayers();
                            };
                        }
                        else {
                            game.chosenCardsDown();
                        }
                    };
                    game.cancelButton.active = true;
                    game.cancelHandler = () => {
                        game.confirmButton.active = false;
                        game.cancelButton.active = false;
                        game.activeEndPlayButton();
                        game.changePhase('play');
                    }
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.weaponControl.nMaxLaunch = 0;
            game.weaponControl.enableCount = 0;
            game.weaponControl.launchSkill = () => {};
        },
    }],
    ['QILINGONG', {
        'type': 'weapon',
        'abbreviation': '麒麟',
        'distance': 5,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 5;
                };
                game.afterKillSucceeded = (seat) => {
                    game.banRestoreControl = true;
                    game.afterKillSucceededDefault(seat);
                    let equipments = game.playerControls[seat].equipments;
                    if(!equipments['HorsePlusOne'] && !equipments['HorseSubOne']) {
                        game.banRestoreControl = false;
                        game.restoreControl();
                        return;
                    }
                    game.selectedCount = 1;
                    game.operateOthersCards(seat, false, false, false, true);
                    game.selectCardsFinish = () => {
                        game.disactiveSelectableCardsBox();
                        game.kickCards(seat);
                        game.banRestoreControl = false;
                        game.restoreControl();
                    };
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.afterKillSucceeded = (seat) => {
                game.afterKillSucceededDefault(seat);
            };
        },
    }],
    ['HANBINGJIAN', {
        'type': 'weapon',
        'abbreviation': '寒冰',
        'distance': 2,
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Weapon');
                game.getWeaponDistance = () => {
                    return 2;
                };
                game.afterKillSucceeded = (seat) => {
                    let setButton1 = (text) => {
                        game.confirmButton.getChildByName('Label').getComponent(cc.Label).string = text;
                    };
                    let setButton2 = (text) => {
                        game.cancelButton.getChildByName('Label').getComponent(cc.Label).string = text;
                    };
                    setButton1('发动寒冰');
                    setButton2('不发动');
                    game.confirmButton.active = true;
                    game.cancelButton.active = true;
                    let recover = () => {
                        setButton1('确认');
                        setButton2('取消');
                        game.confirmButton.active = false;
                        game.cancelButton.active = false;
                    };
                    game.confirmHandler = () => {
                        recover();
                        game.selectedCount = 2;
                        game.operateOthersCards(seat, true, true, true, true);
                        game.selectCardsFinish = () => {
                            game.disactiveSelectableCardsBox();
                            game.kickCards(seat);
                        };
                        game.afterKillFailedDefault(seat);
                    };
                    game.cancelHandler = () => {
                        recover();
                        game.afterKillSucceededDefault(seat);
                    };
                };
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
            game.getWeaponDistance = () => {
                return 1;
            };
            game.afterKillSucceeded = (seat) => {
                game.afterKillSucceededDefault(seat);
            };
        },
    }],
    ['RENWANGDUN', {
        'type': 'armor',
        'abbreviation': '仁王',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.equip(cardControl, 'Armor');
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when unload equipment
        'unload': (game) => {
        },
    }],

    ['WUGUFENGDENG', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => { 
                let askContinue = (seat) => {
                    socket.send({
                        'event':'responseOne', 
                        'subevent':'askContinue', 
                        'to':seat
                    });
                }
                let n = 0;
                for(let playerControl of game.playerControls) {
                    if(!playerControl.isDead) ++n;
                }
                game.whenMagicLaunch();
                socket.send({'event':'getCards', count:n});
                socket.addHandler('getCards', (data) => {
                    game.everyoneGetCard(data.cards);
                    socket.send({
                        'event':'broadcast', 
                        'subevent':'everyoneGetCard',
                        'data':{'cards':data.cards}
                    });
                });
                game.aoe(false, 
                    (seat) => {
                        game.launchMagicCard(
                            () => {
                                socket.send({
                                    'event':'responseOne', 
                                    'subevent':'youChooseOne', 
                                    'to':seat
                                });
                            },
                            () => {
                                askContinue(seat);
                            }
                        );
                    }, null, 
                    () => {
                        game.disactiveSelectableCardsBox();
                        socket.send({
                            'event':'broadcast', 
                            'subevent':'selectCardFinish'
                        });
                    }
                );
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['TAOYUANJIEYI', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                let askContinue = (seat) => {
                    socket.send({
                        'event':'responseOne', 
                        'subevent':'askContinue', 
                        'to':seat
                    });
                }
                game.whenMagicLaunch();
                game.aoe(false, (seat) => {
                    game.launchMagicCard(
                        () => {
                            game.curePlayers([seat], 1);
                            askContinue(seat);
                        },
                        () => {
                            askContinue(seat);
                        }
                    );
                }, (seat) => {
                    if(game.playerControls[seat].health < game.playerControls[seat].maxHealth)
                        return true;
                    return false;
                });
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['NANMANRUQIN', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                let askContinue = (seat) => {
                    socket.send({'event':'responseOne', 'subevent':'askContinue', 'to':seat});
                }
                game.whenMagicLaunch();
                game.aoe(true, (seat) => {
                    game.launchMagicCard(
                        () => {
                            game.requestCards([[null, null, 'SHA']], seat, () => {
                                askContinue(seat);
                            }, () => {
                                game.damageOthers([seat], 1);
                            });
                        },
                        () => {
                            askContinue(seat);
                        }
                    );
                });
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['WANJIANQIFA', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                let askContinue = (seat) => {
                    socket.send({'event':'responseOne', 'subevent':'askContinue', 'to':seat});
                }
                game.whenMagicLaunch();
                game.aoe(true, (seat) => {
                    game.launchMagicCard(
                        () => {
                            game.requestCards([[null, null, 'SHAN']], seat, () => {
                                askContinue(seat);
                            }, () => {
                                game.damageOthers([seat], 1);
                            });
                        },
                        () => {
                            askContinue(seat);
                        }
                    );
                });
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['JUEDOU', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            launchMagicToOneWrap(game, cardControl,
                (seat) => {
                    if(seat === game.seat) return false;
                    if(game.playerControls[seat].isDead) return false;
                    return true;
                },
                (seat) => {
                    game.whenMagicLaunch();
                    game.launchMagicCard(
                        () => {
                            game.duel(seat);
                        },
                        () => {
                            game.restoreControl();
                        }
                    );
                }
            );
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['WUZHONGSHENGYOU', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                game.whenMagicLaunch();
                game.launchMagicCard(
                    () => {
                        socket.send({'event':'drawCards', 'count':2});
                        game.restoreControl();
                    },
                    () => {
                        game.restoreControl();
                    }
                );
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['SHUNSHOUQIANYANG', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            launchMagicToOneWrap(game, cardControl,
                (seat) => {
                    if(seat === game.seat) return false;
                    if(game.playerControls[seat].isDead) return false;
                    let dis = game.getDistance(game.self, game.playerControls[seat]);
                    if(game.getMagicDistance() >= dis) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                (seat) => {
                    game.whenMagicLaunch();
                    game.launchMagicCard(
                        () => {
                            game.selectedCount = 1;
                            game.operateOthersCards(seat, true, true, true, true);
                            game.selectCardsFinish = () => {
                                game.disactiveSelectableCardsBox();
                                game.kickCards(seat, true);
                            };
                            game.restoreControl();
                        },
                        () => {
                            game.restoreControl();
                        }
                    );
                }
            );
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['GUOHECHAIQIAO', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            launchMagicToOneWrap(game, cardControl,
                (seat) => {
                    if(seat === game.seat) return false;
                    if(game.playerControls[seat].isDead) return false;
                    return true;
                },
                (seat) => {
                    game.whenMagicLaunch();
                    game.launchMagicCard(
                        () => {
                            game.selectedCount = 1;
                            game.operateOthersCards(seat, true, true, true, true);
                            game.selectCardsFinish = () => {
                                game.disactiveSelectableCardsBox();
                                game.kickCards(seat);
                            };
                            game.restoreControl();
                        },
                        () => {
                            game.restoreControl();
                        }
                    );
                }
            );
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['JIEDAOSHAREN', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            launchMagicToOneWrap(game, cardControl,
                (seat) => {
                    if(seat === game.seat) return false;
                    if(game.playerControls[seat].isDead) return false;
                    if(!game.playerControls[seat].equipments['Weapon']) return false;
                    return true;
                },
                (killer) => {
                    game.whenMagicLaunch();
                    chooseAnother(game, cardControl,
                        (seat) => {
                            if(seat === killer) return false;
                            if(game.playerControls[seat].isDead) return false;
                            let dis = game.getDistance(game.playerControls[killer], game.playerControls[seat]);
                            if(game.getOthersWeaponDistance(killer) >= dis) {
                                return true;
                            }
                            else {
                                return false;
                            }
                            return true;
                        },
                        (killed) => {
                            game.launchMagicCard(
                                () => {
                                    socket.send({
                                        'event': 'broadcast',
                                        'subevent':'orderOneKillOther', 
                                        'data':{'killer':killer, 'killed':killed}
                                    });
                                },
                                () => {
                                    game.restoreControl();
                                }
                            );
                        }
                    );
                }
            );
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],
    ['WUXIEKEJI', {
        'type': 'magic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': cardForbidden,
        'discard': cardForbidden,
        'wait': cardForbidden,
    }],

    ['LEBUSISHU', {
        'type': 'delaymagic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            launchMagicToOneWrap(game, cardControl,
                (seat) => {
                    if(seat === game.seat) return false;
                    if(game.playerControls[seat].isDead) return false;
                    if(game.playerControls[seat].placedDelayMagicCards.has('LEBUSISHU'))
                        return false;
                    return true;
                },
                (seat) => {
                    game.launchDelayMagic(seat, 'LEBUSISHU');
                }
            );
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        // when judging
        'judging': (game, nextJudge) => {
            game.launchMagicCard(
                () => {
                    game.judge(
                        (cards) => {
                            let card = cards[0];
                            if(card[0] === 'HEART') 
                                return true;
                            else return false;
                        },
                        () => {
                            console.log('LEBUSISHU failed');
                            nextJudge();
                        },
                        () => {
                            console.log('LEBUSISHU succeeded');
                            game.skipPlayPhase = true;
                            nextJudge();
                        }
                    )
                },
                () => {
                    console.log('LEBUSISHU failed');
                    nextJudge();
                }
            );
        }
    }],
    ['SHANDIAN', {
        'type': 'delaymagic',
        'judge': cardForbidden,
        'draw': cardForbidden,
        'play': (game, cardControl) => {
            CardOperationWrap(() => {
                // 闪只有两张，如果有多于两张这里要重写
                let seat = game.seat;
                if(game.self.placedDelayMagicCards.has('SHANDIAN')) {
                    seat = game.getAlivePlayersWithoutSelf(game.seat)[0];
                }
                game.launchDelayMagic(seat, 'SHANDIAN');
            }, game, cardControl);
        },
        'discard': cardForbidden,
        'wait': cardForbidden,
        'judging': (game, nextJudge) => {
            game.launchMagicCard(
                () => {
                    game.judge(
                        (cards) => {
                            let card = cards[0];
                            if(card[0] === 'SPADE' && (card[1] >= 2 && card[1] <= 9)) 
                                return true;
                            else return false;
                        },
                        () => {
                            console.log('SHANDIAN succeeded');
                            game.damageOthers([game.seat], 3);
                            socket.addHandler('youCanContinue', (data) => {
                                game.registerYouCanContinue();
                                nextJudge();
                            });
                        },
                        () => {
                            console.log('SHANDIAN failed');
                            // 闪电只有两张，如果有多于两张这里要重写
                            let alives = game.getAlivePlayersWithoutSelf(game.seat);
                            let seat = alives[0];
                            if(game.playerControls[seat].placedDelayMagicCards.has('SHANDIAN')) {
                                seat = alives[1];
                            }
                            game.launchDelayMagic(seat, 'SHANDIAN');
                            nextJudge();
                        }
                    )
                },
                () => {
                    console.log('SHANDIAN failed');
                    // 闪电只有两张，如果有多于两张这里要重写
                    let alives = game.getAlivePlayersWithoutSelf(game.seat);
                    let seat = alives[0];
                    if(game.playerControls[seat].placedDelayMagicCards.has('SHANDIAN')) {
                        seat = alives[0];
                    }
                    game.launchDelayMagic(seat, 'SHANDIAN');
                    nextJudge();
                }
            );
        }
    }],
]);


module.exports = {
    'Generals': Generals,
    'Skills': Skills,
    'Camps': Camps,
    'Cards': Cards,
};