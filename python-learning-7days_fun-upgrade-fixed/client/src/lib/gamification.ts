export interface BadgeMeta {
  id: string;
  name: string;
  desc: string;
  emoji: string;
}

export const BADGES: BadgeMeta[] = [
  { id: 'day1', name: '启动成功', desc: '完成 Day 1：环境与最小脚本', emoji: '🚀' },
  { id: 'day2', name: '数据搬运工', desc: '完成 Day 2：列表/字典与循环', emoji: '📦' },
  { id: 'day3', name: '逻辑裁判', desc: '完成 Day 3：条件判断 + 函数', emoji: '⚖️' },
  { id: 'day4', name: '文件管理员', desc: '完成 Day 4：文件读写', emoji: '🗂️' },
  { id: 'day5', name: '异常捕手', desc: '完成 Day 5：异常处理 + 调试', emoji: '🛠️' },
  { id: 'day6', name: 'API 探险家', desc: '完成 Day 6：requests 与调用 API', emoji: '🧭' },
  { id: 'day7', name: '脚本召唤师', desc: '完成 Day 7：整合项目', emoji: '🧙‍♂️' },
  { id: 'streak3', name: '连胜 3 天', desc: '连续按顺序完成 3 天', emoji: '🔥' },
  { id: 'streak7', name: '全勤通关', desc: '连续按顺序完成 7 天', emoji: '🏆' },
];

export const badgeById = (id: string) => BADGES.find((b) => b.id === id);

export const levelFromXp = (xp: number) => {
  // Simple, friendly curve: every 100 XP = 1 level, start at 1
  return Math.floor(xp / 100) + 1;
};

export const nextLevelXp = (xp: number) => {
  const level = levelFromXp(xp);
  return level * 100;
};

export const levelProgressPercent = (xp: number) => {
  const level = levelFromXp(xp);
  const prev = (level - 1) * 100;
  const next = level * 100;
  return Math.min(100, Math.max(0, ((xp - prev) / (next - prev)) * 100));
};
