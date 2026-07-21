// 航空航天历史数据
// 图片在 /history/ 目录下（来自 CNSA / CMSE / COMAC / 81.cn / 快懂百科 等国内可访问源）

export interface HistoryItem {
  year: string
  title: string
  desc: string
  image: string
  credit?: string
}

export interface HistorySet {
  title: string
  subtitle: string
  items: HistoryItem[]
}

// 航空发展历程（第 1 课用）
export const aviationHistory: HistorySet = {
  title: '✈️ 航空发展历程：从梦想到现实',
  subtitle: '人类用两千年时间，把神话变成了现实',
  items: [
    {
      year: '1903',
      title: '莱特兄弟首次动力飞行',
      desc: '美国莱特兄弟制造的"飞行者一号"在北卡罗来纳州成功飞行12秒、36米。这是人类首次实现重于空气的有动力可控飞行，标志着现代航空时代开始。',
      image: '/history/wright-1903.jpg',
      credit: 'John T. Daniels / 美国国会图书馆'
    },
    {
      year: '1909',
      title: '冯如：中国航空之父',
      desc: '美籍华裔冯如在美国自制飞机并成功试飞，性能超过同时期莱特兄弟的产品。他怀揣"航空救国"理想回国，被誉为"中国航空之父"。',
      image: '/history/fengru-1909.jpg',
      credit: '旧金山华人历史学会'
    },
    {
      year: '1940s',
      title: '二战战斗机时代',
      desc: 'P-51野马、喷火、零式等经典战斗机改变了空战形态。活塞式飞机的性能在二战中达到巅峰，最高时速突破700km/h，为喷气时代奠定基础。',
      image: '/history/spitfire.jpg',
      credit: '公共领域'
    },
    {
      year: '1969',
      title: '协和客机：超音速民航',
      desc: '英法联合研制的协和客机首飞，巡航速度达2.02马赫（约2200km/h），伦敦到纽约仅需3小时。它是人类唯二投入商业运营的超音速客机，2003年退役。',
      image: '/history/concorde.jpg',
      credit: '英国宇航公司'
    },
    {
      year: '1970',
      title: '波音747：宽体客机时代',
      desc: '波音747首飞，"空中女王"可载客400+，单机运力是此前飞机的2-3倍。它的出现让民航从"贵族专属"变为大众消费，深刻改变了世界交通格局。',
      image: '/history/boeing-747.jpg',
      credit: '波音公司'
    },
    {
      year: '2007',
      title: '空客A380：双层巨无霸',
      desc: '空客A380投入商业运营，双层全客舱可载客500-850人，是世界上最大的客机。它代表了民航工业"更大更经济"的设计哲学。',
      image: '/history/a380.jpg',
      credit: '空中客车公司'
    },
    {
      year: '2017',
      title: 'C919：中国国产大飞机',
      desc: '中国自主研制的C919大型客机成功首飞，中国成为少数能制造大型客机的国家。C919载客158-192人，对标空客A320、波音737，标志中国民航制造业的重大突破。',
      image: '/history/c919.jpg',
      credit: '中国商飞 COMAC'
    },
    {
      year: '2017',
      title: '歼-20：中国隐身战机',
      desc: '中国自主研制的第五代隐身战斗机歼-20正式服役。中国成为继美国之后第二个服役并批量生产隐身战机的国家，标志着中国航空工业跻身世界第一梯队。',
      image: '/history/j20.jpg',
      credit: '中国军网 81.cn'
    },
    {
      year: '2023',
      title: 'C919 商业首航：国产大飞机载客飞行',
      desc: '2023年5月28日，东航MU9191航班从上海虹桥飞抵北京首都，C919完成全球商业首航。此后开通沪蓉、沪京、沪港等定期航线，中国民航制造业迈入商业运营时代。截至2025年初已累计执飞超6600班、安全运行超16000小时。',
      image: '/history/c919-commercial.jpg',
      credit: '中国东方航空 / 中国商飞'
    },
    {
      year: '2024',
      title: 'AG600 鲲龙：水陆两栖大飞机',
      desc: '中国自主研制的大型水陆两栖飞机"鲲龙"AG600取证并进入实用阶段。它能在20秒内汲水12吨，是森林灭火、海上救援的"国之重器"，与运20、C919并称"中国大飞机三剑客"。',
      image: '/history/ag600.jpg',
      credit: '中国航空工业集团 AVIC'
    }
  ]
}

// 航天发展历程（第 9 课用）
export const spaceHistory: HistorySet = {
  title: '🚀 航天发展历程：从理论到星辰',
  subtitle: '人类用一百年时间，挣脱了地球的引力束缚',
  items: [
    {
      year: '1957',
      title: '斯普特尼克1号：太空时代开启',
      desc: '苏联发射世界首颗人造卫星"斯普特尼克1号"，重83.6kg，绕地球运行92天。这一事件震惊西方，引发"太空竞赛"，标志人类正式进入太空时代。',
      image: '/history/sputnik-1957.jpg',
      credit: '苏联塔斯社'
    },
    {
      year: '1961',
      title: '加加林：人类首次进入太空',
      desc: '苏联宇航员尤里·加加林乘"东方一号"飞船绕地球一圈，108分钟的太空飞行让他成为首位进入太空的人类。他的名言"地球是蓝色的"震撼世界。',
      image: '/history/gagarin-1961.jpg',
      credit: '苏联塔斯社'
    },
    {
      year: '1968',
      title: '阿波罗8号：地出',
      desc: '阿波罗8号成为首个环绕月球飞行的人类航天器。宇航员拍下著名的"地出"照片——蔚蓝的地球从月球地平线升起，深刻改变了人类对家园的认知。',
      image: '/history/apollo8-earthrise.jpg',
      credit: 'NASA / William Anders'
    },
    {
      year: '1969',
      title: '阿波罗11号：人类首次登月',
      desc: '美国阿波罗11号成功登月，阿姆斯特朗在月球留下人类第一个脚印，说出"个人一小步，人类一大步"。这是人类航天史的巅峰时刻，全球6亿人见证直播。',
      image: '/history/apollo11.jpg',
      credit: 'NASA'
    },
    {
      year: '1970',
      title: '东方红一号：中国航天开端',
      desc: '中国首颗人造卫星"东方红一号"成功发射，重173kg，用20.009MHz播送《东方红》乐曲。中国成为世界第五个独立发射卫星的国家，开启中国航天时代。',
      image: '/history/dongfanghong-1970.jpg',
      credit: '中国国家航天局 CNSA'
    },
    {
      year: '1981',
      title: '航天飞机：可重复使用时代',
      desc: '美国"哥伦比亚号"航天飞机首飞，是世界首架可重复使用的载人航天器。它能像火箭发射、像飞机着陆，深刻改变了航天运输模式。2011年退役。',
      image: '/history/shuttle.jpg',
      credit: 'NASA'
    },
    {
      year: '1998',
      title: '国际空间站：长期驻留',
      desc: '国际空间站（ISS）开始建造，是人类在轨持续运行时间最长的空间站。来自15个国家的宇航员在此开展科学实验，至今持续有人驻留超过20年。',
      image: '/history/spacestation-iss.jpg',
      credit: 'NASA'
    },
    {
      year: '2003',
      title: '神舟五号：中国首次载人',
      desc: '中国航天员杨利伟乘"神舟五号"飞船进入太空，绕地球14圈。中国成为世界第三个独立掌握载人航天技术的国家。亿万中国人热泪盈眶的历史时刻。',
      image: '/history/yangliwei-2003.jpg',
      credit: '中国载人航天工程办公室 CMSE'
    },
    {
      year: '2019',
      title: '嫦娥四号：首次月背软着陆',
      desc: '中国"嫦娥四号"借助"鹊桥"中继星，在月球背面冯·卡门撞击坑软着陆。这是人类历史上首次月球背面软着陆，"玉兔二号"月球车至今仍在工作。',
      image: '/history/change-yutu.jpg',
      credit: '中国国家航天局 CNSA'
    },
    {
      year: '2021',
      title: '天宫空间站：中国太空家园',
      desc: '中国空间站"天宫"由天和核心舱+问天+梦天实验舱组成，常驻3名航天员开展科学实验。中国成为世界第三个独立建造运营空间站的国家。',
      image: '/history/tiangong-station.jpg',
      credit: '中国载人航天工程办公室 CMSE'
    },
    {
      year: '2024',
      title: '嫦娥六号：人类首次月背采样返回',
      desc: '2024年6月25日，嫦娥六号返回器携1935.3克月壤在内蒙古四子王旗着陆。这是人类历史上首次从月球背面（南极-艾特肯盆地）采样返回，证实该盆地形成于42.5亿年前。中国探月工程又一次创造世界航天史。',
      image: '/history/change6-2024.jpg',
      credit: '中国国家航天局 CNSA'
    },
    {
      year: '2025',
      title: '天问二号：中国首次小行星采样',
      desc: '2025年5月29日，天问二号由长征三号乙火箭在西昌发射升空，开启中国首次小行星采样返回任务。它将对近地小行星2016HO3（"振荡天星"）进行探测取样并返回地球，此后继续飞往主带彗星311P开展科学探测，整个任务持续约10年。',
      image: '/history/tianwen2.jpg',
      credit: '中国国家航天局 CNSA'
    },
    {
      year: '2026',
      title: '梦舟飞船：载人登月新一代飞船',
      desc: '2026年2月11日，长征十号火箭一级配合梦舟飞船完成"最大动压逃逸飞行试验"，一级最高飞行至105公里突破卡门线。梦舟飞船、揽月着陆器、长征十号火箭——中国载人登月"三大件"研制取得阶段性突破，中国人登月的目标正在加速实现。',
      image: '/history/lunar-mengzhou.jpg',
      credit: '中国载人航天工程办公室 CMSE'
    }
  ]
}
