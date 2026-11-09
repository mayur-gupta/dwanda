// Skeleton poses and forward kinematics.
// Angles are in degrees, facing right. Limbs are measured from straight down; positive swings forward.
// Arms ride on the torso lean. The second number of each limb is the bend at elbow/knee.
import { DEG } from './utils.js';

export const mk = (torso, head, aF, aB, lF, lB, rot = 0) => ({
  torso, head,
  aFu: aF[0], aFl: aF[1], aBu: aB[0], aBl: aB[1],
  lFu: lF[0], lFl: lF[1], lBu: lB[0], lBl: lB[1],
  rot,
});

export const POSES = {
  idle:        mk(10, -6, [50, 100], [30, 115], [22, -18], [-18, -8]),
  crouch:      mk(24, -14, [45, 105], [25, 115], [80, -115], [38, -108]),
  block:       mk(-2, -8, [30, 135], [55, 115], [20, -16], [-22, -8]),
  crouchBlock: mk(16, -14, [25, 140], [50, 120], [80, -115], [38, -108]),
  jumpUp:      mk(4, -4, [60, 95], [20, 110], [75, -105], [25, -95]),
  jumpDown:    mk(8, -6, [45, 100], [10, 110], [55, -80], [10, -60]),
  hit:         mk(-24, -18, [15, 40], [-25, 50], [14, -14], [-28, -10]),
  hitAir:      mk(-35, -20, [-20, 30], [-45, 40], [30, -50], [-10, -40]),
  ko:          mk(0, 10, [160, 10], [140, 20], [12, -8], [-6, -4], 88),
  win:         mk(-6, -10, [165, 15], [-10, 120], [18, -10], [-20, -6]),
};

// Each move has a windup pose (during startup) and a strike pose (during active frames).
export const MOVE_POSES = {
  punch:    { windup: mk(4, -6, [25, 120], [35, 110], [24, -18], [-20, -8]),     strike: mk(18, -8, [72, -2], [5, 130], [32, -22], [-26, -4]) },
  kick:     { windup: mk(-6, -8, [45, 100], [10, 90], [70, -110], [-12, -6]),    strike: mk(-18, -6, [55, 95], [-35, 70], [102, -6], [-10, -4]) },
  lowPunch: { windup: mk(22, -14, [30, 115], [25, 115], [80, -115], [38, -108]), strike: mk(30, -12, [58, -2], [20, 120], [82, -112], [40, -110]) },
  sweep:    { windup: mk(30, -10, [20, 60], [10, 60], [70, -120], [50, -140]),   strike: mk(40, -10, [25, 20], [5, 40], [86, -2], [52, -145]) },
  airPunch: { windup: mk(0, -4, [25, 115], [20, 110], [75, -105], [25, -95]),    strike: mk(16, -10, [78, 2], [10, 120], [70, -100], [20, -90]) },
  airKick:  { windup: mk(-4, -6, [50, 100], [20, 100], [80, -120], [20, -100]),  strike: mk(-10, -6, [50, 95], [15, 100], [62, -2], [10, -105]) },
  special:  { windup: mk(-12, -4, [-30, 110], [-40, 115], [25, -20], [-25, -8]), strike: mk(16, -6, [76, 4], [68, 12], [34, -24], [-28, -4]) },
};

export function movePoses(ch, name) { return (ch.poses && ch.poses[name]) || MOVE_POSES[name] || MOVE_POSES.punch; }

export function idlePose(t) {
  const b = Math.sin(t * 0.06);
  return mk(10 + b * 1.5, -6, [50 + b * 3, 100 - b * 4], [30 + b * 2, 115], [22, -18 - b * 3], [-18, -8 - b * 2]);
}

export function walkPose(ph) {
  const s = Math.sin(ph), c = Math.cos(ph);
  return mk(12, -6, [50 + s * 8, 100], [30 - s * 8, 112], [4 + s * 26, -12 - Math.max(0, c) * 34], [4 - s * 26, -12 - Math.max(0, -c) * 34]);
}

export function lerpPose(p, q, k) { for (const key in q) p[key] += (q[key] - p[key]) * k; }

export const BONES = { torso: 60, neck: 7, head: 17, upperArm: 33, foreArm: 31, thigh: 44, shin: 44, foot: 15 };

// Converts joint angles into 2D points, relative to the hip. pt.low = lowest point (ground contact).
export function solvePose(pose, f) {
  const B = BONES, pt = { hip: [0, 0] }, tor = pose.torso * DEG;
  pt.sho = [Math.sin(tor) * f * B.torso, -Math.cos(tor) * B.torso];
  const hd = (pose.torso + pose.head) * DEG, hr = B.neck + B.head;
  pt.head = [pt.sho[0] + Math.sin(hd) * f * hr, pt.sho[1] - Math.cos(hd) * hr];
  const arm = (u, l) => {
    const a1 = (u + pose.torso) * DEG, a2 = (u + l + pose.torso) * DEG;
    const e = [pt.sho[0] + Math.sin(a1) * f * B.upperArm, pt.sho[1] + Math.cos(a1) * B.upperArm];
    return [e, [e[0] + Math.sin(a2) * f * B.foreArm, e[1] + Math.cos(a2) * B.foreArm]];
  };
  const leg = (u, l) => {
    const a1 = u * DEG, a2 = (u + l) * DEG, fa = (u + l + 90) * DEG;
    const k = [Math.sin(a1) * f * B.thigh, Math.cos(a1) * B.thigh];
    const an = [k[0] + Math.sin(a2) * f * B.shin, k[1] + Math.cos(a2) * B.shin];
    return [k, an, [an[0] + Math.sin(fa) * f * B.foot, an[1] + Math.cos(fa) * B.foot]];
  };
  [pt.elbF, pt.handF] = arm(pose.aFu, pose.aFl);
  [pt.elbB, pt.handB] = arm(pose.aBu, pose.aBl);
  [pt.kneeF, pt.ankF, pt.toeF] = leg(pose.lFu, pose.lFl);
  [pt.kneeB, pt.ankB, pt.toeB] = leg(pose.lBu, pose.lBl);
  pt.footF = [(pt.ankF[0] + pt.toeF[0]) / 2, (pt.ankF[1] + pt.toeF[1]) / 2];
  pt.footB = [(pt.ankB[0] + pt.toeB[0]) / 2, (pt.ankB[1] + pt.toeB[1]) / 2];
  pt.low = Math.max(pt.ankF[1], pt.ankB[1], pt.toeF[1], pt.toeB[1], pt.kneeF[1], pt.kneeB[1]) + 4;
  return pt;
}
