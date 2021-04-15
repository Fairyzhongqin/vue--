// wenhao: 文书编号
// gaizhang：盖章状态
// zhifazhang: 执法专用章
// fujian：文书附件
// shenpi：审核审批状态
// shengchan：生产经营单位
// fawen：发文对象
// songda：受送达单位
// dangshi：当事人
// chouyang：被抽样取证人
// xunwen：被询问人姓名
// chenshu：陈述申辩人
// tingzheng：听证人
// anjian：案件名称
// chengbanren：承办人
// chengbanbumen：承办部门
// auditTypeCode: 审查审核审批流程 类型code
// qianming: 签名
let dataList = [
  [
    'ws10001',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80005',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //立案审批表
  [
    'ws10002',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80003',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //现场检查方案
  [
    'ws10003',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //现场检查记录
  [
    'ws10004',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //现场处理措施决定书
  [
    'ws10005',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //责令限期整改
  [
    'ws10006',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //整改复查意见书
  [
    'ws10007',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80032',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //行政强制审批表
  [
    'ws10008',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //查封扣押决定书
  [
    'ws10009',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: false,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //查封扣押（场所、设施、财物）清单
  [
    'ws10010',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //延长查封扣押期限决定书

  [
    'ws10011',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //查封扣押处理决定书
  [
    'ws10012',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: true,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //停止供电（供应民用爆炸物品）通知书
  [
    'ws10013',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: true,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //停止供电（供应民用爆炸物品）决定书
  [
    'ws10014',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: true,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //恢复供电（供应民用爆炸物品）通知书
  [
    'ws10015',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: true,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //询问通知书
  [
    'ws10016',
    {
      wenhao: false,
      gaizhang: false,
      zhifazhang: false,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: true,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //询问笔录
  [
    'ws10017',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: true,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //勘验笔录
  [
    'ws10018',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: true,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //抽样取样凭证
  [
    'ws10019',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: false,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80008',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //先行登记保存证据审批表
  [
    'ws10020',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //先行登记保存证据通知书

  [
    'ws10021',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80011',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //先行登记保存证据处理审批表
  [
    'ws10022',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //先行登记保存证据处理决定表
  [
    'ws10023',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //鉴定委托书
  [
    'ws10024',
    {
      wenhao: true,
      gaizhang: true,
      zhifazhang: false,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: true,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //行政处罚告知书
  [
    'ws10025',
    {
      wenhao: false,
      gaizhang: false,
      zhifazhang: false,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: true,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //当事人陈述申辩笔录
  [
    'ws10026',
    {
      wenhao: true,
      gaizhang: true,
      zhifazhang: false,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //听证告知书
  [
    'ws10027',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //听证会通知书
  [
    'ws10028',
    {
      wenhao: false,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: true,
      anjian: true,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //听证笔录
  [
    'ws10029',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //听证会报告书

  [
    'ws10030',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: false,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80018',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //案件处理呈批表
  [
    'ws100301',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80018',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false
    }
  ], //案件处理呈批表（二次呈批）
  [
    'ws10031',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //行政处罚集体讨论记录
  [
    'ws10032',
    {
      wenhao: true,
      gaizhang: true,
      zhifazhang: false,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //行政（当场）处罚决定书（单位）
  [
    'ws10033',
    {
      wenhao: true,
      gaizhang: true,
      zhifazhang: false,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //行政（当场）处罚决定书（个人）
  [
    'ws10034',
    {
      wenhao: true,
      gaizhang: true,
      zhifazhang: false,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //行政处罚决定书（单位）
  [
    'ws10035',
    {
      wenhao: true,
      gaizhang: true,
      zhifazhang: false,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //行政处罚决定书（个人）
  [
    'ws10036',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //罚款催缴通知书
  [
    'ws10037',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //加处罚款决定书
  [
    'ws10038',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80022',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //延期（分期）缴纳罚款审批表
  [
    'ws10039',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //延期（分期）缴纳罚款批准书
  [
    'ws10040',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //文书送达回执

  [
    'ws10041',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //行政强制执行事先催告书
  [
    'ws10042',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //强制执行申请书
  [
    'ws10043',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80020',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //案件移送审批表
  [
    'ws10044',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //案件移送书
  [
    'ws10045',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80026',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //案件延期审批表
  [
    'ws10046',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80024',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //结案审批表
  [
    'ws10047',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: true,
      chengbanren: true,
      chengbanbumen: true,
      qianming: false
    }
  ], //案卷（首页）
  [
    'ws10048',
    {
      wenhao: false,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: true,
      chengbanren: true,
      chengbanbumen: true,
      qianming: false
    }
  ], //卷 内 目 录
  [
    'ws10049',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80014',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //行政处罚案件审批表
  [
    'ws10050',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //不予行政处罚决定书

  [
    'ws10051',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: '', // coding 等后端确定
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //行政处罚法制审核意见书审核流程表
  [
    'ws10052',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //案件撤销记录单
  [
    'ws10053',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: true,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //行政处罚案件调查报告
  [
    'ws10054',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //非职责范围安全问题移交单
  [
    'ws10055',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //整改复查延期申请答复书
  [
    'ws10056',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: false,
      // gaizhang: false, zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80030',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: true
    }
  ], //整改复查延期申请审批表
  [
    'ws10057',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: true,
      shenpi: false,
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], //图片文书
  [
    'ws10059',
    {
      wenhao: true,
      gaizhang: false,
      zhifazhang: true,
      fujian: false,
      shenpi: true,
      auditTypeCode: 'ta80014',
      shengchan: false,
      fawen: false,
      songda: false,
      dangshi: false,
      chouyang: false,
      xunwen: false,
      chenshu: false,
      tingzheng: false,
      anjian: false,
      chengbanren: false,
      chengbanbumen: false,
      qianming: false
    }
  ], // 行政处罚法制审核意见书
  [
    'ws1003012',
    {
      gaizhang: false,
      zhifazhang: false,
      shenpi: true,
      auditTypeCode: 'ta80043',
      qianming: true
    }
  ] // 案件告知审批表
  // 需要承办人签字、不需要加盖公章、需要走流程、不需要上传签字文书
]

let writTypeMap = new Map(dataList)

export default writTypeMap
