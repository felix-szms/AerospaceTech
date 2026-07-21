<template>
  <div class="tool-container">
    <h2 class="tool-title">📜 中国航天成就时间线</h2>
    <p class="tool-desc">
      从东方红一号到嫦娥六号，半个多世纪的跨越。点击任意节点查看详情。
    </p>

    <!-- 筛选按钮 -->
    <div class="preset-buttons">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="preset-btn"
        :class="{ active: activeCategory === cat.key }"
        @click="setCategory(cat.key)"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- 时间线主体 -->
    <div class="timeline">
      <div
        v-for="(item, index) in filteredEvents"
        :key="index"
        class="timeline-item"
        @click="toggleDetail(index)"
      >
        <div class="timeline-year">{{ item.year }}</div>
        <div class="timeline-title">{{ item.title }}</div>
        <div class="timeline-desc">{{ item.brief }}</div>
        <div v-if="expandedIndex === index" class="timeline-detail">
          <p>{{ item.detail }}</p>
          <div class="detail-meta">
            <span class="meta-tag">🏷️ {{ item.category }}</span>
            <span v-if="item.significance" class="meta-tag">⭐ {{ item.significance }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识总结 -->
    <div class="knowledge-section">
      <h3>💡 关键数据</h3>
      <div class="result-grid">
        <div class="result-card">
          <div class="label">中国首颗卫星</div>
          <div class="value">1970</div>
          <div class="unit">东方红一号</div>
        </div>
        <div class="result-card">
          <div class="label">首次载人航天</div>
          <div class="value">2003</div>
          <div class="unit">神舟五号 · 杨利伟</div>
        </div>
        <div class="result-card">
          <div class="label">首次月背采样</div>
          <div class="value">2024</div>
          <div class="unit">嫦娥六号 · 人类首次</div>
        </div>
        <div class="result-card">
          <div class="label">空间站建成</div>
          <div class="value">2022</div>
          <div class="unit">天宫空间站</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = [
  { key: 'all', label: '全部', icon: '🌐' },
  { key: 'satellite', label: '卫星', icon: '🛰️' },
  { key: 'manned', label: '载人航天', icon: '🧑‍🚀' },
  { key: 'lunar', label: '月球探测', icon: '🌙' },
  { key: 'deep', label: '深空探测', icon: '🚀' },
  { key: 'station', label: '空间站', icon: '🏠' },
  { key: 'nav', label: '北斗导航', icon: '🧭' }
]

const activeCategory = ref('all')
const expandedIndex = ref(-1)

const events = [
  {
    year: '1970.04.24',
    title: '东方红一号 · 中国第一颗人造卫星',
    brief: '中国成为世界第五个独立发射卫星的国家',
    detail: '长征一号火箭在酒泉卫星发射中心将东方红一号送入近地轨道，卫星重173公斤，用20.009MHz频率播送《东方红》乐曲。标志着中国进入太空时代。',
    category: '卫星',
    significance: '世界第五个独立发射卫星的国家'
  },
  {
    year: '1975.11.26',
    title: '返回式卫星首次成功回收',
    brief: '中国成为世界第三个掌握卫星回收技术的国家',
    detail: '返回式卫星是中国早期最重要的应用卫星系列，用于对地观测。成功回收意味着中国掌握了再入返回技术，为后来的载人航天和月球采样返回奠定基础。',
    category: '卫星',
    significance: '世界第三个掌握卫星回收技术'
  },
  {
    year: '1990.04.07',
    title: '长征三号商业发射 · 进入国际市场',
    brief: '长征火箭首次承揽国际商业发射',
    detail: '长征三号在西昌发射中心将美国制造的亚洲一号通信卫星送入转移轨道，标志中国航天进入国际商业发射市场。',
    category: '卫星',
    significance: '进入国际商业航天市场'
  },
  {
    year: '1999.11.20',
    title: '神舟一号 · 载人航天工程首飞',
    brief: '中国载人航天工程（921工程）的首次无人飞行试验',
    detail: '神舟一号是载人飞船的第一次不载人飞行试验，验证了飞船的关键技术。飞行21小时后成功返回。从此开启中国载人航天三步走战略：载人→空间实验室→空间站。',
    category: '载人航天',
    significance: '921工程首飞'
  },
  {
    year: '2003.10.15',
    title: '神舟五号 · 杨利伟 · 中国首次载人航天飞行',
    brief: '杨利伟成为进入太空的第一位中国航天员',
    detail: '长征二号F火箭将神舟五号飞船送入太空，航天员杨利伟在轨飞行21小时23分，绕地球14圈后安全返回。中国成为世界第三个独立掌握载人航天技术的国家。这一刻让亿万中国人热泪盈眶。',
    category: '载人航天',
    significance: '世界第三个独立掌握载人航天'
  },
  {
    year: '2007.10.24',
    title: '嫦娥一号 · 中国首次月球探测',
    brief: '中国月球探测工程正式开启',
    detail: '嫦娥一号绕月卫星成功发射，绘制了首幅全月球影像图，是中国月球探测"绕、落、回"三步走的第一步"绕"。',
    category: '月球探测',
    significance: '月球探测三步走·绕'
  },
  {
    year: '2008.09.25',
    title: '神舟七号 · 翟志刚太空行走',
    brief: '中国首次太空出舱活动（EVA）',
    detail: '航天员翟志刚出舱活动，挥舞五星红旗，成为中国太空行走第一人。这次任务掌握了出舱活动关键技术，为空间站建造打下基础。',
    category: '载人航天',
    significance: '首次太空行走'
  },
  {
    year: '2011.09.29',
    title: '天宫一号 · 中国首个空间实验室',
    brief: '中国空间站建设的第一步',
    detail: '天宫一号目标飞行器发射，随后与神舟八号、九号、十号完成多次交会对接。其中神舟十号航天员王亚平进行了中国首次太空授课。',
    category: '空间站',
    significance: '空间实验室阶段开启'
  },
  {
    year: '2013.12.14',
    title: '嫦娥三号 · 玉兔号月球车登陆月球',
    brief: '中国首次地外天体软着陆',
    detail: '嫦娥三号着陆器和玉兔号月球车在月球虹湾区软着陆，中国成为世界第三个实现月面软着陆的国家。玉兔号月球车在月面工作了一年多。',
    category: '月球探测',
    significance: '月球探测三步走·落'
  },
  {
    year: '2018.02.02',
    title: '少年星一号 · 中国首颗教育共享卫星',
    brief: '由10万中小学生参与设计的科普卫星',
    detail: '九天微星研制的3U立方星，由中国宋庆龄基金会等联合发起"中国少年微星计划"。建有测控分站的中小学可开设卫星测控课程，学生在教室与在轨卫星互动测控。是航天科普教育的标志性事件。',
    category: '卫星',
    significance: '首颗教育共享卫星'
  },
  {
    year: '2018.12.08',
    title: '嫦娥四号 · 人类首次月球背面软着陆',
    brief: '嫦娥四号登陆月球背面，玉兔二号继续工作',
    detail: '嫦娥四号借助鹊桥中继星，在月球背面冯·卡门撞击坑软着陆。这是人类历史上首次月球背面软着陆。玉兔二号月球车至今仍在月背工作，成为工作时间最长的月球车。',
    category: '月球探测',
    significance: '人类首次月背软着陆'
  },
  {
    year: '2020.06.23',
    title: '北斗三号最后一颗组网卫星发射',
    brief: '北斗三号全球卫星导航系统星座部署完成',
    detail: '第55颗北斗导航卫星成功发射，标志北斗三号全球系统星座部署完成。7月31日北斗三号全球卫星导航系统正式开通。中国成为世界第三个独立建成全球卫星导航系统的国家。北斗独有短报文、星间链路等特色功能。',
    category: '北斗导航',
    significance: '全球卫星导航系统建成'
  },
  {
    year: '2020.12.17',
    title: '嫦娥五号 · 中国首次月球采样返回',
    brief: '1731克月壤样品返回地球',
    detail: '嫦娥五号完成月球采样返回任务，从月球风暴洋采集1731克月壤样品带回地球。中国成为世界第三个从月球采样返回的国家。这是月球探测"绕、落、回"三步走的收官之战。',
    category: '月球探测',
    significance: '月球探测三步走·回·世界第三个采样返回'
  },
  {
    year: '2021.04.29',
    title: '天和核心舱发射 · 中国空间站开建',
    brief: '中国空间站（天宫）全面开建',
    detail: '长征五号B火箭将空间站天和核心舱送入轨道。随后问天、梦天实验舱分别于2022年发射，中国空间站完成T字构型建造。',
    category: '空间站',
    significance: '中国空间站开建'
  },
  {
    year: '2021.05.15',
    title: '天问一号 · 祝融号火星车登陆火星',
    brief: '中国首次火星探测任务一次实现"绕、着、巡"三大目标',
    detail: '天问一号火星探测器在火星乌托邦平原南部预选着陆区着陆，祝融号火星车驶上火星表面。中国成为世界第二个在火星上部署火星车的国家。一次任务实现环绕、着陆、巡视三大目标，在世界航天史上属首次。',
    category: '深空探测',
    significance: '世界第二个火星车·一次任务三大目标'
  },
  {
    year: '2021.12.09',
    title: '"天宫课堂"第一课开讲',
    brief: '中国首个太空科普教育品牌，航天员担任太空教师',
    detail: '神舟十三号乘组航天员翟志刚、王亚平、叶光富在中国空间站进行首次太空授课，地面主课堂设在中国科技馆。王亚平此前在2013年神舟十号任务中进行了中国首次太空授课。',
    category: '载人航天',
    significance: '太空科普教育品牌'
  },
  {
    year: '2022.11.03',
    title: '梦天实验舱对接 · 中国空间站建成',
    brief: '空间站T字基本构型完成在轨建造',
    detail: '梦天实验舱与空间站组合体完成交会对接，中国空间站三舱"T"字基本构型完成。中国空间站命名为"天宫"，由天和核心舱、问天实验舱、梦天实验舱组成。',
    category: '空间站',
    significance: '空间站建成'
  },
  {
    year: '2024.06.25',
    title: '嫦娥六号 · 人类首次月球背面采样返回',
    brief: '从月球背面采集1935.3克样品返回地球',
    detail: '嫦娥六号在月球背面南极-艾特肯盆地完成采样，并成功返回。这是人类历史上首次月球背面采样返回，是航天史上的重大突破。样品为研究月球早期演化和太阳系形成提供珍贵材料。',
    category: '月球探测',
    significance: '人类首次月背采样返回'
  }
]

const filteredEvents = computed(() => {
  if (activeCategory.value === 'all') return events
  const cat = categories.find(c => c.key === activeCategory.value)
  return events.filter(e => e.category === cat.label)
})

const setCategory = (key) => {
  activeCategory.value = key
  expandedIndex.value = -1
}

const toggleDetail = (index) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}
</script>

<style scoped>
.tool-desc {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.preset-btn.active {
  border-color: var(--space-primary);
  color: var(--space-primary);
  background: rgba(79, 195, 247, 0.1);
}

.detail-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.meta-tag {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  background: rgba(79, 195, 247, 0.1);
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-radius: 4px;
  color: var(--space-primary);
}

.knowledge-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
