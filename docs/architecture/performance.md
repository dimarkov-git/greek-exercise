# Performance guidelines

This document outlines performance targets, measurement strategies, and optimization techniques for the Learn Greek application.

## Performance budgets

### Bundle size limits

- **Main bundle**: ≤ 250KB gzip
- **Route chunk**: ≤ 150KB gzip

These limits ensure fast initial page loads and efficient code splitting.

### Runtime performance targets (KPIs)

- **Unit test flake**: < 1%
- **Largest Contentful Paint (LCP)**: < 2.5s (local development)
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Optimization techniques

### Code splitting strategies

- **Route-based splitting**: Each page component should be lazy-loaded
- **Component-based splitting**: Heavy components (>50KB) should be dynamically imported
- **Feature-based splitting**: Non-critical features should load on-demand

### React optimization patterns

- **Memoization**: Use `React.memo` for expensive renders
- **Stable callbacks**: Wrap callbacks with `useCallback` to prevent unnecessary re-renders
- **State placement**: Keep state as close to components that use it as possible
- **List virtualization**: For long lists (>100 items), implement virtualization

### Bundle optimization

- **Tree shaking**: Import only needed functions (`import { specific } from 'library'`)
- **Dynamic imports**: Use `import()` for conditional or late-loaded code
- **Asset optimization**: Compress images, use modern formats (WebP, AVIF)
- **CDN assets**: Serve static assets from CDN when possible

## Performance measurement

### Development tools

- **Lighthouse**: Run regular audits (target score >90)
- **Bundle analyzer**: `pnpm build && npx vite-bundle-analyzer dist`
- **React DevTools Profiler**: Identify expensive components

### Monitoring commands

```bash
# Analyze bundle size
pnpm build
npx vite-bundle-analyzer dist

# Performance audit
lighthouse http://localhost:5173 --view

# Memory usage profiling
# Use React DevTools Profiler tab
```

### CI/CD integration

Performance budgets are enforced through:

1. **Build-time checks**: Bundle size limits in build process
2. **Lighthouse CI**: Automated performance audits on PRs
3. **Bundle analysis**: Size regression detection

## Performance regression handling

### Detection

- **Automated alerts**: CI fails if budgets are exceeded
- **Size diff reports**: Bundle analyzer runs on every PR
- **Performance monitoring**: Lighthouse scores tracked over time

### Resolution strategies

1. **Code splitting**: Split large chunks into smaller pieces
2. **Lazy loading**: Defer non-critical feature loading
3. **Feature flags**: Hide expensive features behind flags
4. **Rollback**: Revert changes that cause significant regressions

### Emergency procedures

If performance degrades significantly:

1. **Immediate**: Revert the problematic commit
2. **Short-term**: Implement feature flag to disable expensive features
3. **Long-term**: Refactor with proper performance considerations

## Best practices checklist

### During development

- [ ] Profile components with React DevTools before committing
- [ ] Use `React.memo` for components that render frequently
- [ ] Implement lazy loading for route components
- [ ] Optimize images and assets before adding to repository
- [ ] Run `pnpm build` to check bundle size impact

### Code review

- [ ] Check for unnecessary re-renders
- [ ] Verify proper memoization usage
- [ ] Ensure dynamic imports are used appropriately
- [ ] Review asset sizes and optimization
- [ ] Confirm bundle size stays within limits

### Pre-deployment

- [ ] Run full Lighthouse audit
- [ ] Verify bundle analyzer results
- [ ] Test on slower devices/networks
- [ ] Confirm all performance budgets are met
- [ ] Document any performance trade-offs made