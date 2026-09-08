import pandas as pd, numpy as np, json, math, warnings
warnings.filterwarnings('ignore')
U='/mnt/user-data/uploads/'; OUT='/home/claude/portfolio/public/data/'

# ---------- UTM zone 10N -> WGS84 (GRS80/WGS84 ellipsoid) ----------
def utm_to_ll(E, N, zone=10):
    a=6378137.0; f=1/298.257223563; e2=2*f-f*f; ep2=e2/(1-e2); k0=0.9996
    x=E-500000.0; y=N
    M=y/k0; mu=M/(a*(1-e2/4-3*e2**2/64-5*e2**3/256))
    e1=(1-math.sqrt(1-e2))/(1+math.sqrt(1-e2))
    phi1=mu+(3*e1/2-27*e1**3/32)*np.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*np.sin(4*mu)+(151*e1**3/96)*np.sin(6*mu)
    N1=a/np.sqrt(1-e2*np.sin(phi1)**2); T1=np.tan(phi1)**2; C1=ep2*np.cos(phi1)**2
    R1=a*(1-e2)/(1-e2*np.sin(phi1)**2)**1.5; D=x/(N1*k0)
    lat=phi1-(N1*np.tan(phi1)/R1)*(D**2/2-(5+3*T1+10*C1-4*C1**2-9*ep2)*D**4/24+(61+90*T1+298*C1+45*T1**2-252*ep2-3*C1**2)*D**6/720)
    lon=(D-(1+2*T1+C1)*D**3/6+(5-2*C1+28*T1-3*C1**2+8*ep2+24*T1**2)*D**5/120)/np.cos(phi1)
    lon0=math.radians((zone-1)*6-180+3)
    return np.degrees(lon)+math.degrees(lon0), np.degrees(lat)

def load(f, sheet='Sheet1'): return pd.read_excel(U+f, sheet_name=sheet, engine='xlrd')
off=load('Offences.xls'); off['lon'],off['lat']=utm_to_ll(off['X'].values, off['Y'].values)
off['date']=pd.to_datetime(off['Rep_Date'], errors='coerce')
print('offences ll range', off.lon.min(), off.lon.max(), off.lat.min(), off.lat.max())

# ---------- 1. density grid (KDE, bandwidth 549 m, 350 m cells) ----------
bw=549.0; cell=350.0
xmin,xmax,ymin,ymax=off.X.min()-1500,off.X.max()+1500,off.Y.min()-1500,off.Y.max()+1500
nx=int((xmax-xmin)//cell)+1; ny=int((ymax-ymin)//cell)+1
def kde(sub):
    g=np.zeros((ny,nx)); r=int(3*bw//cell)+1
    gx=np.arange(nx)*cell+xmin+cell/2; gy=np.arange(ny)*cell+ymin+cell/2
    for x,y in zip(sub.X.values, sub.Y.values):
        i=int((x-xmin)//cell); j=int((y-ymin)//cell)
        i0,i1=max(0,i-r),min(nx,i+r+1); j0,j1=max(0,j-r),min(ny,j+r+1)
        dx=gx[i0:i1]-x; dy=gy[j0:j1]-y
        g[j0:j1,i0:i1]+=np.exp(-(dx[None,:]**2+dy[:,None]**2)/(2*bw*bw))
    return g
A=kde(off[(off.date>='2020-01-01')&(off.date<='2020-04-30')]); B=kde(off[(off.date>='2020-05-01')&(off.date<='2020-08-31')])
C=B-A; cells=[]
thr=0.02*max(A.max(),B.max())
for j in range(ny):
    for i in range(nx):
        if A[j,i]>thr or B[j,i]>thr:
            lon,lat=utm_to_ll(xmin+i*cell, ymin+j*cell)
            cells.append([round(float(lon),5),round(float(lat),5),round(float(A[j,i]),2),round(float(B[j,i]),2),round(float(C[j,i]),2)])
json.dump({'cell':cell,'maxA':round(float(A.max()),2),'maxB':round(float(B.max()),2),'maxC':round(float(np.abs(C).max()),2),
  'nA':int(((off.date>='2020-01-01')&(off.date<='2020-04-30')).sum()),'nB':int(((off.date>='2020-05-01')&(off.date<='2020-08-31')).sum()),
  'cells':cells}, open(OUT+'density.json','w'))
print('density cells', len(cells), 'maxA', A.max(), 'maxB', B.max())

# ---------- 2. Green Timbers assaults within 800 m, Mar-Jul 2020 ----------
def ll_to_utm(lon,lat):
    # forward via iteration on our inverse (small area): use simple search
    a=6378137.0; f=1/298.257223563; e2=2*f-f*f; k0=0.9996; lon0=math.radians(-123)
    phi=math.radians(lat); lam=math.radians(lon)-lon0; ep2=e2/(1-e2)
    Nn=a/math.sqrt(1-e2*math.sin(phi)**2); T=math.tan(phi)**2; Cc=ep2*math.cos(phi)**2; Aa=math.cos(phi)*lam
    M=a*((1-e2/4-3*e2**2/64-5*e2**3/256)*phi-(3*e2/8+3*e2**2/32+45*e2**3/1024)*math.sin(2*phi)+(15*e2**2/256+45*e2**3/1024)*math.sin(4*phi)-(35*e2**3/3072)*math.sin(6*phi))
    E=k0*Nn*(Aa+(1-T+Cc)*Aa**3/6+(5-18*T+T**2+72*Cc-58*ep2)*Aa**5/120)+500000
    N=k0*(M+Nn*math.tan(phi)*(Aa**2/2+(5-T+9*Cc+4*Cc**2)*Aa**4/24+(61-58*T+T**2+600*Cc-330*ep2)*Aa**6/720))
    return E,N
park=[(-122.836,49.166),(-122.815,49.166),(-122.815,49.1835),(-122.836,49.1835)]
pu=[ll_to_utm(*p) for p in park]; pxmin,pxmax=min(p[0] for p in pu),max(p[0] for p in pu); pymin,pymax=min(p[1] for p in pu),max(p[1] for p in pu)
def dist_rect(x,y):
    dx=max(pxmin-x,0,x-pxmax); dy=max(pymin-y,0,y-pymax); return math.hypot(dx,dy)
asl=off[off.Crime_1.str.startswith('ASSAULT',na=False)&(off.date>='2020-03-01')&(off.date<='2020-07-31')].copy()
asl['d']=[dist_rect(x,y) for x,y in zip(asl.X,asl.Y)]
gt=asl[asl.d<=800]
pts=[{'p':[round(r.lon,5),round(r.lat,5)],'t':r.Crime_1,'d':r.date.strftime('%Y-%m-%d'),'h':int(r.RHour) if pd.notna(r.RHour) else None} for r in gt.itertuples()]
json.dump({'park':park,'points':pts,'counts':gt.Crime_1.value_counts().to_dict()}, open(OUT+'greentimbers.json','w'))
print('green timbers', len(pts), gt.Crime_1.value_counts().to_dict())

# ---------- 3. Caper Crossroads explorer layers ----------
def layer(f, join_mo=False):
    d=load(f); d['lon'],d['lat']=utm_to_ll(d.X.values,d.Y.values); d['date']=pd.to_datetime(d.Rep_Date,errors='coerce')
    if join_mo:
        mo=load('BurglaryMO.xls'); d=d.merge(mo,on='File',how='left',suffixes=('','_mo'))
    rows=[]
    for r in d.itertuples():
        o={'p':[round(r.lon,5),round(r.lat,5)],'d':r.date.strftime('%Y-%m-%d') if pd.notna(r.date) else None,'w':r.Rep_DOW,'h':int(r.RHour) if pd.notna(r.RHour) else None,'c':r.Crime_1,'z':r.Zone if isinstance(r.Zone,str) else None,'l':r.Crime_Loca if isinstance(r.Crime_Loca,str) else None}
        if join_mo:
            for k in ['Category','Scene','Way','Access_Method','Occupancy_Status','Tools_Used','Signature','Target_Area1']:
                v=getattr(r,k,None); o[k[:3].lower()]=v if isinstance(v,str) else None
        rows.append(o)
    return rows
cap={'burglary':layer('Burglary.xls',True),'robbery':layer('StreetRobbery_Offences.xls'),'prostitution':layer('Prostitution_Offences.xls'),'autotheft':layer('SC_Auto_Theft.xls')}
json.dump(cap, open(OUT+'caper.json','w'))
print('caper', {k:len(v) for k,v in cap.items()})

# ---------- 4. Moss Park from Toronto MCI rows ----------
xl=pd.ExcelFile('/home/claude/mosspark_clean.xlsx')
cats={'Assault':'ASSAULT','B&E':'Break_and_Enter','Robbery':'Robbery','Auto theft':'Auto_Theft_'}
mp={'yearly':{}, 'monthly':{}, 'dow':{}, 'hour':{}, 'offence':{}}
months=['January','February','March','April','May','June','July','August','September','October','November','December']
dows=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
for k,sh in cats.items():
    d=xl.parse(sh); d=d[d.NEIGHBOURHOOD_158.astype(str).str.startswith('Moss Park')]
    yc=d.REPORT_YEAR.value_counts(); mp['yearly'][k]={int(y):int(yc.get(y,0)) for y in range(2014,2025)}
    mc=d.REPORT_MONTH.value_counts(); mp['monthly'][k]=[int(mc.get(m,0)) for m in months]
    wc=d.REPORT_DOW.astype(str).str.strip().value_counts(); mp['dow'][k]=[int(wc.get(w,0)) for w in dows]
    hc=d.REPORT_HOUR.value_counts(); mp['hour'][k]=[int(hc.get(h,0)) for h in range(24)]
    mp['offence'][k]=d.OFFENCE.value_counts().head(6).to_dict()
mp['years']=list(range(2014,2025)); mp['months']=[m[:3] for m in months]; mp['dows']=[w[:3] for w in dows]
json.dump(mp, open(OUT+'mosspark.json','w'))
print('moss park yearly', mp['yearly'])

# ---------- 5. Surrey B&E dashboard rows ----------
dd=pd.read_excel(U+'Sonny_Nguyen_DashboardAssignment.xlsx', sheet_name='Data')
dd['ReportedDate']=pd.to_datetime(dd['ReportedDate'])
def idx(col):
    vals=sorted(dd[col].astype(str).unique().tolist()); return vals,{v:i for i,v in enumerate(vals)}
L={}; lk={}
for c in ['District','Location Type','ItemsStolen','Offence','Neighbourhood','Area (within Neighbourhood)','InvestigationStatus']:
    L[c],lk[c]=idx(c)
dn={'Monday':0,'Tuesday':1,'Wednesday':2,'Thursday':3,'Friday':4,'Saturday':5,'Sunday':6}
rows=[]
for r in dd.itertuples(index=False):
    t=str(r.ReportedTime); hour=int(t.split(':')[0]) if ':' in t else 0
    rows.append([int(r.ReportedDate.month), dn.get(r._2,0), hour, lk['District'][str(r.District)], lk['Location Type'][str(r._7)], lk['ItemsStolen'][str(r.ItemsStolen)], int(r.DamageCost), lk['Offence'][str(r.Offence)], lk['Neighbourhood'][str(r.Neighbourhood)], lk['Area (within Neighbourhood)'][str(r._15)], lk['InvestigationStatus'][str(r.InvestigationStatus)], int(r.Priority)])
json.dump({'lookups':{'district':L['District'],'locationType':L['Location Type'],'items':L['ItemsStolen'],'offence':L['Offence'],'neighbourhood':L['Neighbourhood'],'area':L['Area (within Neighbourhood)'],'status':L['InvestigationStatus']},'cols':['month','dow','hour','district','locationType','items','damage','offence','neighbourhood','area','status','priority'],'rows':rows}, open(OUT+'dashboard.json','w'), separators=(',',':'))
print('dashboard rows', len(rows), 'neighbourhoods', L['Neighbourhood'], 'districts', L['District'])
